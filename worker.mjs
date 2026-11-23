import { assets } from './assets.mjs';

const topics = ['School', 'Host family or accommodation', 'Friends and settling in', 'Wellbeing', 'Travel or logistics', 'Other'];
const needs = ['none','soon','urgent'];
const statuses = ['open','in progress','resolved'];
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function weekOf(date) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0,10);
}
const text = value => typeof value === 'string' ? value.trim() : '';
const headers = {'cache-control':'no-store','referrer-policy':'no-referrer','x-content-type-options':'nosniff'};
const json = (body,status=200) => Response.json(body,{status,headers});
const fail = (error,status=400) => json({error},status);
const rosterSql = 'SELECT id,name,email,destination,start_date,end_date,token FROM students ORDER BY name';
const rowsSql = 'SELECT f.*,s.name,s.destination FROM feedback f JOIN students s ON s.id=f.student_id ORDER BY created_at DESC';
const all = async (db,sql,...args) => (await db.prepare(sql).bind(...args).all()).results;
const first = (db,sql,...args) => db.prepare(sql).bind(...args).first();
const run = (db,sql,...args) => db.prepare(sql).bind(...args).run();
const validDate = value => /^\d{4}-\d\d-\d\d$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;

async function deliver(db,url,secret,event) {
  if (!url || !secret) return 'unconfigured';
  const time = now();
  const lease = await run(db,`INSERT INTO delivery VALUES (?,?,'sending',?)
    ON CONFLICT(id) DO UPDATE SET state='sending',updated_at=excluded.updated_at
    WHERE delivery.state='failed' OR (delivery.state='sending' AND delivery.updated_at < ?)`,
    event.id,event.kind,time,new Date(Date.now()-300000).toISOString());
  if (!lease.meta.changes) return 'already claimed';
  let state = 'failed';
  try {
    const response = await fetch(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(7000),
      headers:{'content-type':'application/json',authorization:'Bearer '+secret,'idempotency-key':event.id},
      body:JSON.stringify(event)});
    if (response.ok) state = 'sent';
  } catch {}
  await run(db,'UPDATE delivery SET state=?,updated_at=? WHERE id=? AND updated_at=?',state,now(),event.id,time);
  return state;
}

function feedbackEvent(record) {
  return { id:'feedback:'+record.id,kind:'feedback',record };
}

async function api(request,env,ctx,url) {
  const path=url.pathname;
  const method=request.method;
  const db=env.DB;
  const day=today(), week=weekOf(day);
  const email=request.headers.get('oai-authenticated-user-email')?.toLowerCase();
  const allow=String(env.STAFF_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
  // The hosted site starts owner-private. Configure STAFF_EMAILS before widening site access.
  const staff=Boolean(request.headers.get('oai-authenticated-user-id') && (!allow.length || allow.includes(email)));
  const automation=Boolean(env.JOB_SECRET && request.headers.get('authorization')==='Bearer '+env.JOB_SECRET);
  if (method==='POST' && !automation && request.headers.get('origin')!==url.origin) return fail('Invalid request origin.',403);

  if (path==='/api/demo') return fail('Demo data is handled in the browser.',404);
  if (!db) return fail('The CRM database is unavailable.',503);

  if (path==='/api/student' || path==='/api/submit') {
    if ((path==='/api/student' && method!=='GET') || (path==='/api/submit' && method!=='POST')) return fail('Method unavailable.',405);
    const input = method==='POST' ? await request.json() : {};
    const token = method==='POST' ? text(input.token) : url.searchParams.get('token');
    if (!token || token.length!==64) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    const student = await first(db,'SELECT id,name,start_date,end_date FROM students WHERE token=?',token);
    if (!student) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    if (student.start_date>day || student.end_date<day) return fail('This check-in link is outside your program dates.',409);
    const existing=await first(db,"SELECT id FROM feedback WHERE student_id=? AND week=? AND kind='check-in'",student.id,week);
    if (method==='GET') return json({name:student.name,week,submitted:!!existing});
    const kind=input.kind, mood=Number(input.mood), need=input.need, topic=text(input.topic), note=text(input.note);
    if (!['check-in','message'].includes(kind) || !needs.includes(need) || (topic && !topics.includes(topic)) ||
        note.length>2000 || (kind==='check-in' && (!Number.isInteger(mood)||mood<1||mood>5)) ||
        (kind==='message' && !note)) return fail('Please complete the required fields.');
    if (kind==='check-in' && existing) return fail('Your check-in for this week is already saved.',409);
    const submissionId=text(input.id);
    if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return fail('Reload the form and try again.');
    const priority = need==='urgent' ? 'urgent' : need==='soon'||kind==='message'||mood<=2 ? 'follow' : 'routine';
    const result=await run(db,`INSERT OR IGNORE INTO feedback
      (id,student_id,week,kind,mood,need,topic,note,priority,status,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`,submissionId,student.id,week,kind,kind==='message'?null:mood,need,topic,note,priority,priority==='routine'?'resolved':'open',now());
    const record=await first(db,'SELECT f.*,s.name,s.destination FROM feedback f JOIN students s ON s.id=f.student_id WHERE f.id=? AND f.student_id=?',submissionId,student.id);
    if (!record) return fail('A check-in for this week already exists. Reload to send a separate message.',409);
    if (result.meta.changes && env.SHEET_WEBHOOK_URL && env.WEBHOOK_SECRET)
      ctx.waitUntil(deliver(db,env.SHEET_WEBHOOK_URL,env.WEBHOOK_SECRET,feedbackEvent(record)).catch(()=>{}));
    return json({saved:true,priority:record.priority});
  }

  if (path==='/api/jobs' && method==='POST' && (staff||automation)) {
    const origin=url.origin;
    const eligible=await all(db,`SELECT s.* FROM students s WHERE start_date<=? AND end_date>=?
      AND NOT EXISTS(SELECT 1 FROM feedback f WHERE f.student_id=s.id AND f.kind='check-in' AND f.week=?)
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='reminder:'||s.id||':'||? AND d.state='sent') LIMIT 25`,day,day,week,week);
    const pending=await all(db,`SELECT f.*,s.name,s.destination FROM feedback f JOIN students s ON s.id=f.student_id
      WHERE NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='feedback:'||f.id AND d.state='sent') ORDER BY f.created_at LIMIT 25`);
    const outcomes=[];
    for(const [destination,events] of [
      [env.REMINDER_WEBHOOK_URL,eligible.map(s=>({id:'reminder:'+s.id+':'+week,kind:'weekly-reminder',week,to:s.email,name:s.name,
        subject:'Your weekly Gobeyond check-in',message:'How has your week abroad been? Share a quick update with your Gobeyond team.',
        link:origin+'/check-in#'+s.token}))],
      [env.SHEET_WEBHOOK_URL,pending.map(feedbackEvent)]
    ]) {
      if (!destination || !env.WEBHOOK_SECRET) continue;
      outcomes.push(...await Promise.all(events.map(event=>deliver(db,destination,env.WEBHOOK_SECRET,event))));
    }
    return json({reminderConfigured:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),sheetConfigured:!!(env.SHEET_WEBHOOK_URL&&env.WEBHOOK_SECRET),
      sent:outcomes.filter(s=>s==='sent').length,failed:outcomes.filter(s=>s==='failed').length});
  }
  if (!staff) return fail('Staff access is required.',403);

  if (path==='/api/data' && method==='GET') {
    const [students,feedback]=await Promise.all([all(db,rosterSql),all(db,rowsSql)]);
    const sheetUrl = typeof env.GOOGLE_SHEET_URL === 'string' &&
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]+\/edit$/.test(env.GOOGLE_SHEET_URL)
      ? env.GOOGLE_SHEET_URL : null;
    return json({students,feedback,day,week,integrations:{
      sheet:!!(env.SHEET_WEBHOOK_URL&&env.WEBHOOK_SECRET), sheetUrl,
      reminder:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),
      reminderScheduled:env.WEEKLY_EMAIL_SCHEDULE==='daily'}});
  }
  if (path==='/api/students' && method==='POST') {
    const input=await request.json();
    const name=text(input.name), address=text(input.email).toLowerCase(), destination=text(input.destination), start=text(input.start_date), end=text(input.end_date);
    if (!name||name.length>100||!destination||destination.length>120||address.length>254||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)||!validDate(start)||!validDate(end)||start>end) return fail('Check the student details and program dates.');
    const token=id().replaceAll('-','')+id().replaceAll('-','');
    const result=await run(db,'INSERT OR IGNORE INTO students VALUES (?,?,?,?,?,?,?)',id(),name,address,destination,start,end,token);
    return result.meta.changes ? json({saved:true},201) : fail('This student email already exists.',409);
  }
  if (path==='/api/status' && method==='POST') {
    const input=await request.json();
    if (!statuses.includes(input.status)||typeof input.id!=='string') return fail('Choose a valid status.');
    const result=await run(db,'UPDATE feedback SET status=? WHERE id=?',input.status,input.id);
    return result.meta.changes ? json({saved:true}) : fail('The feedback record was not found.',404);
  }
  return fail('This page does not exist.',404);
}

export default { async fetch(request,env,ctx) {
  const url=new URL(request.url);
  if(url.pathname.startsWith('/api/')) {
    try { return await api(request,env,ctx,url); }
    catch(error) {
      if (error instanceof SyntaxError) return fail('The request could not be read.');
      console.error(error.message);
      return fail('The CRM could not complete the request. Try again.',500);
    }
  }
  const name=url.pathname==='/'||url.pathname==='/check-in' ? '/index.html' : url.pathname;
  const asset=Object.hasOwn(assets,name)&&assets[name];
  return asset ? new Response(asset.body,{headers:{...headers,'content-type':asset.type}}) : new Response('Page not found',{status:404,headers});
}};
