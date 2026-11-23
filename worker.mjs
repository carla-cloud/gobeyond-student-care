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
const rosterSql = 'SELECT id,name,email,destination,start_date,end_date,token FROM students WHERE deleted_at IS NULL ORDER BY name';
const feedbackWithStudent='SELECT f.*,s.name,s.destination FROM feedback f JOIN students s ON s.id=f.student_id';
const rowsSql=feedbackWithStudent+' WHERE f.deleted_at IS NULL AND s.deleted_at IS NULL ORDER BY f.created_at DESC';
const all = async (db,sql,...args) => (await db.prepare(sql).bind(...args).all()).results;
const first = (db,sql,...args) => db.prepare(sql).bind(...args).first();
const run = (db,sql,...args) => db.prepare(sql).bind(...args).run();
const validDate = value => /^\d{4}-\d\d-\d\d$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;

function sheetDestination(env) {
  if (/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.SHEET_APPS_SCRIPT_URL||'') &&
      env.SHEET_APPS_SCRIPT_SECRET) {
    return {url:env.SHEET_APPS_SCRIPT_URL,secret:env.SHEET_APPS_SCRIPT_SECRET,googleScript:true};
  }
  if (env.SHEET_WEBHOOK_URL && env.WEBHOOK_SECRET)
    return {url:env.SHEET_WEBHOOK_URL,secret:env.WEBHOOK_SECRET};
  return null;
}

async function postToGoogleScript(url,secret,event) {
  const issuedAt=Date.now();
  const payload=JSON.stringify(event);
  const encoder=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(issuedAt+'.'+payload)));
  const signature=btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
  const signal=AbortSignal.timeout(15000);
  let response=await fetch(url,{method:'POST',redirect:'manual',signal,
    headers:{'content-type':'application/json'},body:JSON.stringify({issuedAt,payload,signature})});
  if (response.status===302||response.status===303) {
    const location=response.headers.get('location');
    if (!location) return false;
    const redirect=new URL(location);
    if (redirect.origin!=='https://script.googleusercontent.com') return false;
    response=await fetch(redirect,{redirect:'error',signal});
  }
  return response.ok && (await response.json()).ok===true;
}

async function deliver(db,destination,event) {
  const {url,secret,googleScript}=destination;
  const time = now();
  const lease = await run(db,`INSERT INTO delivery VALUES (?,?,'sending',?)
    ON CONFLICT(id) DO UPDATE SET state='sending',updated_at=excluded.updated_at
    WHERE delivery.state='failed' OR (delivery.state='sending' AND delivery.updated_at < ?)`,
    event.id,event.kind,time,new Date(Date.now()-300000).toISOString());
  if (!lease.meta.changes) return 'already claimed';
  let state = 'failed';
  try {
    if (googleScript) {
      if (await postToGoogleScript(url,secret,event)) state = 'sent';
    } else {
      const response=await fetch(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(7000),
        headers:{'content-type':'application/json',authorization:'Bearer '+secret,'idempotency-key':event.id},
        body:JSON.stringify(event)});
      if (response.ok) state = 'sent';
    }
  } catch {}
  await run(db,'UPDATE delivery SET state=?,updated_at=? WHERE id=? AND updated_at=?',state,now(),event.id,time);
  return state;
}

function priorityFor(kind,mood,need) {
  if (need==='urgent') return 'urgent';
  if (need==='soon' || kind==='message' || mood<=2) return 'follow';
  return 'routine';
}

function feedbackEvent(record) {
  return { id:'feedback:'+record.id,kind:'feedback',record };
}

const staffCookie='__Host-gobeyond-staff';
const staffSessionAge=30*24*60*60;
const staffCookieValue=(value,seconds)=>`${staffCookie}=${value}; Path=/; Max-Age=${seconds}; HttpOnly; Secure; SameSite=Lax`;
const utf8=new TextEncoder();
async function digest(value) {
  const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',utf8.encode(value)));
  return Array.from(bytes,byte=>byte.toString(16).padStart(2,'0')).join('');
}
function decodeUrlPart(value) {
  return Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')), c=>c.charCodeAt(0));
}
async function verifyInvite(invite,secret,allow) {
  if (!secret || typeof invite!=='string' || !/^[a-z0-9_-]{30,1024}\.[a-z0-9_-]{43}$/i.test(invite)) return null;
  try {
    const [payload,signature]=invite.split('.');
    const key=await crypto.subtle.importKey('raw',utf8.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
    if (!await crypto.subtle.verify('HMAC',key,decodeUrlPart(signature),utf8.encode(payload))) return null;
    const {email,expiresAt,nonce,reusable}=JSON.parse(new TextDecoder().decode(decodeUrlPart(payload)));
    const validLifetime=reusable===true || (Number.isSafeInteger(expiresAt) && expiresAt>Date.now());
    if (!allow.includes(email) || !validLifetime || typeof nonce!=='string' || !/^[0-9a-f]{64}$/.test(nonce)) return null;
    return {email,nonce,reusable:reusable===true};
  } catch {
    return null;
  }
}
function browserSession(request) {
  const cookie=request.headers.get('cookie')?.split(';').map(value=>value.trim()).find(value=>value.startsWith(staffCookie+'='));
  const value=cookie?.slice(staffCookie.length+1);
  return /^[0-9a-f]{64}$/.test(value||'') ? value : null;
}
async function staffSignIn(request,env,allow) {
  const {invite}=await request.json();
  const grant=await verifyInvite(invite,env.STAFF_INVITE_SECRET,allow);
  if (!grant) return fail('This staff sign-in link is invalid or expired.',401);
  const session=id().replaceAll('-','')+id().replaceAll('-','');
  const expires=new Date(Date.now()+staffSessionAge*1000).toISOString();
  const sessionDigest=await digest(session);
  const replayKey=grant.reusable ? sessionDigest : await digest(grant.nonce);
  const result=await run(env.DB,'INSERT OR IGNORE INTO staff_access VALUES (?,?,?,?)',replayKey,sessionDigest,grant.email,expires);
  if (!result.meta.changes) return fail(grant.reusable?'Could not start a staff session. Try again.':'This staff sign-in link has already been used.',409);
  return Response.json({signedIn:true},{headers:{...headers,'set-cookie':staffCookieValue(session,staffSessionAge)}});
}

async function api(request,env,ctx,url) {
  const path=url.pathname;
  const method=request.method;
  const db=env.DB;
  const sheet=sheetDestination(env);
  const day=today(), week=weekOf(day);
  const email=request.headers.get('oai-authenticated-user-email')?.toLowerCase();
  const allow=String(env.STAFF_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
  const signedIn=Boolean(request.headers.get('oai-authenticated-user-id'));
  const nativeStaff=signedIn && allow.includes(email);
  const automation=Boolean(env.JOB_SECRET && request.headers.get('authorization')==='Bearer '+env.JOB_SECRET);
  if (method==='POST' && !automation && request.headers.get('origin')!==url.origin) return fail('Invalid request origin.',403);

  if (path==='/api/demo') return fail('Demo data is handled in the browser.',404);
  if (!db) return fail('The CRM database is unavailable.',503);
  if (path==='/api/staff/sign-in' && method==='POST') return staffSignIn(request,env,allow);
  const session=browserSession(request);
  if (path==='/api/staff/sign-out' && method==='POST') {
    if (session) await run(db,'UPDATE staff_access SET session_digest=NULL WHERE session_digest=?',await digest(session));
    return Response.json({signedOut:true},{headers:{...headers,'set-cookie':staffCookieValue('',0)}});
  }


  if (path==='/api/student' || path==='/api/submit') {
    if (method!=='POST') return fail('Method unavailable.',405);
    const input = await request.json();
    const token = text(input.token);
    if (!/^[0-9a-f]{64}$/i.test(token)) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    const student = await first(db,'SELECT id,name,start_date,end_date FROM students WHERE token=? AND deleted_at IS NULL',token);
    if (!student) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    if (student.start_date>day || student.end_date<day) return fail('This check-in link is outside your program dates.',409);
    const existing=await first(db,"SELECT id FROM feedback WHERE student_id=? AND week=? AND kind='check-in' AND deleted_at IS NULL",student.id,week);
    if (path==='/api/student') return json({name:student.name,week,submitted:!!existing});
    const kind=input.kind, mood=Number(input.mood), need=input.need, topic=text(input.topic), note=text(input.note);
    if (!['check-in','message'].includes(kind) || !needs.includes(need) || (topic && !topics.includes(topic)) ||
        note.length>2000 || (kind==='check-in' && (!Number.isInteger(mood)||mood<1||mood>5)) ||
        (kind==='message' && !note)) return fail('Please complete the required fields.');
    if (kind==='check-in' && existing) return fail('Your check-in for this week is already saved.',409);
    const submissionId=text(input.id);
    if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return fail('Reload the form and try again.');
    const priority=priorityFor(kind,mood,need);
    await run(db,`INSERT OR IGNORE INTO feedback
      (id,student_id,week,kind,mood,need,topic,note,priority,status,created_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM students WHERE id=? AND deleted_at IS NULL)`,
      submissionId,student.id,week,kind,kind==='message'?null:mood,need,topic,note,priority,priority==='routine'?'resolved':'open',now(),student.id);
    const record=await first(db,'SELECT f.*,s.name,s.destination FROM feedback f JOIN students s ON s.id=f.student_id WHERE f.id=? AND f.student_id=? AND f.deleted_at IS NULL AND s.deleted_at IS NULL',submissionId,student.id);
    if (!record) return fail('A check-in for this week already exists. Reload to send a separate message.',409);
    if (sheet) ctx.waitUntil(deliver(db,sheet,feedbackEvent(record)).catch(()=>{}));
    return json({saved:true,priority:record.priority});
  }

  const access=session && env.STAFF_INVITE_SECRET
    ? await first(db,'SELECT email FROM staff_access WHERE session_digest=? AND expires_at>?',await digest(session),now())
    : null;
  const invitedStaff=!!access && allow.includes(access.email);
  const staff=nativeStaff || invitedStaff;
  if (path==='/api/jobs' && method==='POST' && (staff||automation)) {
    const origin=url.origin;
    const eligible=await all(db,`SELECT s.* FROM students s WHERE s.deleted_at IS NULL AND start_date<=? AND end_date>=?
      AND NOT EXISTS(SELECT 1 FROM feedback f WHERE f.student_id=s.id AND f.kind='check-in' AND f.week=? AND f.deleted_at IS NULL)
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='reminder:'||s.id||':'||? AND d.state='sent') LIMIT 25`,day,day,week,week);
    const pending=await all(db,`SELECT f.*,s.name,s.destination FROM feedback f JOIN students s ON s.id=f.student_id
      WHERE f.deleted_at IS NULL AND s.deleted_at IS NULL
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='feedback:'||f.id AND d.state='sent') ORDER BY f.created_at LIMIT 25`);
    const outcomes=[];
    for(const [destination,events] of [
      [env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET?{url:env.REMINDER_WEBHOOK_URL,secret:env.WEBHOOK_SECRET}:null,eligible.map(s=>({id:'reminder:'+s.id+':'+week,kind:'weekly-reminder',week,to:s.email,name:s.name,
        subject:'Your weekly Gobeyond check-in',message:'How has your week abroad been? Share a quick update with your Gobeyond team.',
        link:origin+'/check-in#'+s.token}))],
      [sheet,pending.map(feedbackEvent)]
    ]) {
      if (!destination) continue;
      outcomes.push(...await Promise.all(events.map(event=>deliver(db,destination,event))));
    }
    return json({reminderConfigured:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),sheetConfigured:!!sheet,
      sent:outcomes.filter(s=>s==='sent').length,failed:outcomes.filter(s=>s==='failed').length});
  }
  if (!staff) return fail(signedIn ? 'Staff access is required.' : 'Sign in to open the staff workspace.',signedIn ? 403 : 401);

  if (path==='/api/data' && method==='GET') {
    const [students,feedback,deletedStudents,deletedFeedback]=await Promise.all([
      all(db,rosterSql),all(db,rowsSql),
      all(db,'SELECT id,name,email,destination,start_date,end_date,deleted_at FROM students WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'),
      all(db,feedbackWithStudent+' WHERE f.deleted_at IS NOT NULL AND s.deleted_at IS NULL ORDER BY f.deleted_at DESC')
    ]);
    const sheetUrl = typeof env.GOOGLE_SHEET_URL === 'string' &&
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]+\/edit$/.test(env.GOOGLE_SHEET_URL)
      ? env.GOOGLE_SHEET_URL : null;
    return json({students,feedback,deletedStudents,deletedFeedback,day,week,staffSession:invitedStaff,integrations:{
      sheet:!!sheet, sheetUrl,
      reminder:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),
      reminderScheduled:env.WEEKLY_EMAIL_SCHEDULE==='daily'}});
  }
  if ((path==='/api/students' || path==='/api/students/update') && method==='POST') {
    const input=await request.json() || {};
    const name=text(input.name), address=text(input.email).toLowerCase(), destination=text(input.destination), start=text(input.start_date), end=text(input.end_date);
    if (!name||name.length>100||!destination||destination.length>120||address.length>254||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)||!validDate(start)||!validDate(end)||start>end) return fail('Check the student details and program dates.');
    const token=id().replaceAll('-','')+id().replaceAll('-','');
    if (path==='/api/students/update') {
      const studentId=text(input.id);
      const result=await run(db,`UPDATE OR IGNORE students SET name=?, email=?, destination=?, start_date=?, end_date=?,
        token=CASE WHEN email<>? THEN ? ELSE token END WHERE id=? AND deleted_at IS NULL`,
        name,address,destination,start,end,address,token,studentId);
      if (result.meta.changes) return json({saved:true});
      const existing=await first(db,'SELECT id FROM students WHERE id=? AND deleted_at IS NULL',studentId);
      return existing ? fail('This student email already exists.',409) : fail('The student record was not found.',404);
    }
    const result=await run(db,'INSERT OR IGNORE INTO students (id,name,email,destination,start_date,end_date,token) VALUES (?,?,?,?,?,?,?)',id(),name,address,destination,start,end,token);
    if (result.meta.changes) return json({saved:true},201);
    const removed=await first(db,'SELECT id FROM students WHERE email=? AND deleted_at IS NOT NULL',address);
    return fail(removed?'This student is in Recently deleted. Restore them to use this email.':'This student email already exists.',409);
  }
  const removal=path.match(/^\/api\/(students|feedback)\/(delete|restore)$/);
  if (removal && method==='POST') {
    const [,table,action]=removal;
    const {id:recordId}=await request.json() || {};
    if (typeof recordId!=='string' || !recordId) return fail('Choose a record.');
    const deleting=action==='delete';
    const allowedParent=table==='feedback'?' AND student_id IN (SELECT id FROM students WHERE deleted_at IS NULL)':'';
    const result=await run(db,`UPDATE OR IGNORE ${table} SET deleted_at=? WHERE id=?${allowedParent}`,
      deleting?now():null,recordId);
    if (result.meta.changes) return json({saved:true});
    const record=await first(db,`SELECT id FROM ${table} WHERE id=?${allowedParent}`,recordId);
    return record ? fail('This student already has a check-in for that week.',409) : fail('The record was not found.',404);
  }
  if (path==='/api/feedback/update' && method==='POST') {
    const input=await request.json() || {};
    const recordId=text(input.id);
    const record=await first(db,'SELECT kind FROM feedback WHERE id=? AND deleted_at IS NULL AND student_id IN (SELECT id FROM students WHERE deleted_at IS NULL)',recordId);
    if (!record) return fail('The feedback record was not found.',404);
    const {kind}=record;
    const mood=kind==='check-in'?Number(input.mood):null;
    const need=input.need, topic=text(input.topic), note=text(input.note);
    if (!needs.includes(need) || (topic && !topics.includes(topic)) || note.length>2000 ||
        (kind==='check-in' && (!Number.isInteger(mood)||mood<1||mood>5)) ||
        (kind==='message' && !note)) return fail('Please complete the required fields.');
    const priority=priorityFor(kind,mood,need);
    const changed='id=? AND deleted_at IS NULL AND student_id IN (SELECT id FROM students WHERE deleted_at IS NULL) AND (mood IS NOT ? OR need IS NOT ? OR topic IS NOT ? OR note IS NOT ?)';
    const fields=[recordId,mood,need,topic,note];
    await db.batch([
      db.prepare(`INSERT INTO feedback_edits SELECT ?, id, ?, ?, mood, need, topic, note, priority, status
        FROM feedback WHERE ${changed}`).bind(id(),now(),nativeStaff?email:access.email,...fields),
      db.prepare(`UPDATE feedback SET mood=?, need=?, topic=?, note=?, priority=?,
        status=CASE WHEN ?='routine' THEN 'resolved'
          WHEN priority='routine' OR (?='urgent' AND priority<>'urgent' AND status='resolved') THEN 'open'
          ELSE status END WHERE ${changed}`).bind(mood,need,topic,note,priority,priority,priority,...fields)
    ]);
    return json({saved:true});
  }
  if (path==='/api/status' && method==='POST') {
    const input=await request.json();
    if (!statuses.includes(input.status)||typeof input.id!=='string') return fail('Choose a valid status.');
    const result=await run(db,'UPDATE feedback SET status=? WHERE id=? AND deleted_at IS NULL AND student_id IN (SELECT id FROM students WHERE deleted_at IS NULL)',input.status,input.id);
    return result.meta.changes ? json({saved:true}) : fail('The feedback record was not found.',404);
  }
  return fail('This page does not exist.',404);
}

const escapeHtml=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function emailReceipt(message,status,token='') {
  const link=/^[0-9a-f]{64}$/i.test(token)
    ? `<p><a class="btn" href="/check-in#${token}">Open your check-in form</a></p>` : '';
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gobeyond check-in</title><link rel="stylesheet" href="/style.css"></head>
    <body><main class="formpage"><section class="card formbody"><h1>Gobeyond check-in</h1>
    <p class="sub">${escapeHtml(message)}</p>${link}</section></main></body></html>`,{
    status,headers:{...headers,'content-type':'text/html; charset=utf-8','content-security-policy':"frame-ancestors 'none'"}
  });
}

async function emailCheckIn(request,env,ctx,url) {
  if (request.method!=='POST') return emailReceipt('Open the personal check-in form in your email.',405);
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/x-www-form-urlencoded'))
    return emailReceipt('Open your personal form link to check in.',415);
  if (Number(request.headers.get('content-length'))>32000) return emailReceipt('This check-in is too long.',413);
  const body=await request.text();
  if (body.length>32000) return emailReceipt('This check-in is too long.',413);
  const fields=new URLSearchParams(body);
  const token=fields.get('token')||'';
  if (fields.get('week')!==weekOf(today()))
    return emailReceipt('This email is from a previous week. Open the form for your current check-in.',409,token);
  const target=new URL('/api/submit',url);
  const submission={id:id(),token,kind:'check-in',mood:fields.get('mood'),
    need:fields.get('need'),topic:fields.get('topic'),note:fields.get('note')};
  const result=await api(new Request(target,{method:'POST',headers:{origin:url.origin},
    body:JSON.stringify(submission)}),env,ctx,target);
  if (result.ok) return emailReceipt('Thanks for sharing. Your check-in has been saved.',200);
  const {error}=await result.json();
  return emailReceipt(error||'Open your form to try again.',result.status,token);
}

export default { async fetch(request,env,ctx) {
  const url=new URL(request.url);
  if(url.pathname.startsWith('/api/')) {
    try {
      if (url.pathname==='/api/email-check-in') return await emailCheckIn(request,env,ctx,url);
      return await api(request,env,ctx,url);
    }
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
