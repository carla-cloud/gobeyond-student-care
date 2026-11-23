import {mkdir,readFile,writeFile,copyFile,cp} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
const assets={};
for(const [name,type] of Object.entries({'index.html':'text/html','style.css':'text/css','app.js':'text/javascript'})) {
 assets['/'+name]={type:type+'; charset=utf-8',body:await readFile('public/'+name,'utf8')};
}
const worker=(await readFile('worker.mjs','utf8')).replace("import { assets } from './assets.mjs';",'const assets = '+JSON.stringify(assets)+';');
await writeFile('dist/server/index.js',worker);
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
await cp('drizzle','dist/drizzle',{recursive:true});
