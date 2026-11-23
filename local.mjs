import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
await import('./build.mjs');
const { default:worker }=await import('./dist/server/index.js');
const db=new DatabaseSync('preview.sqlite');
db.exec(await readFile('drizzle/0000_initial.sql','utf8'));
for (const [table,file] of [['staff_access','0001_staff_access'],['feedback_edits','0002_feedback_edit_history']]) {
 const initialized=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
 if (!initialized) db.exec(await readFile('drizzle/'+file+'.sql','utf8'));
}
if (!db.prepare("SELECT name FROM pragma_table_info('students') WHERE name='deleted_at'").get()) {
 db.exec(await readFile('drizzle/0003_record_removals.sql','utf8'));
}
const DB={
 prepare(sql){return {bind(...args){return {
  async first(){return db.prepare(sql).get(...args)??null;},
  async all(){return {results:db.prepare(sql).all(...args)};},
  run(){return {meta:db.prepare(sql).run(...args)};}
 };}};},
 batch(statements){
  db.exec('BEGIN');
  try {
   const results=statements.map(statement=>statement.run());
   db.exec('COMMIT');
   return results;
  } catch(error) {
   db.exec('ROLLBACK');
   throw error;
  }
 }
};
const portArg=process.argv.indexOf('--port');
const port=Number((portArg>=0&&process.argv[portArg+1])||process.env.PORT||3000);
createServer(async (req,res)=>{
 const parts=[];
 for await(const chunk of req) parts.push(chunk);
 const headers=new Headers(req.headers);
 headers.set('oai-authenticated-user-id','local-preview');
 headers.set('oai-authenticated-user-email','staff@example.test');
 const origin=headers.get('origin');
 const host=origin ? new URL(origin).host : headers.get('host');
 const response=await worker.fetch(new Request((origin?new URL(origin).protocol:'http:')+'//'+host+req.url,{method:req.method,headers,body:parts.length?Buffer.concat(parts):undefined}),{DB,STAFF_EMAILS:'staff@example.test'},{waitUntil(){}});
 res.writeHead(response.status,Object.fromEntries(response.headers));
 res.end(Buffer.from(await response.arrayBuffer()));
}).listen(port,'0.0.0.0',()=>console.log('Preview listening on '+port));
