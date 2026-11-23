import { assets } from './assets.mjs';

const topics = ['School', 'Host family or accommodation', 'Friends and settling in', 'Wellbeing', 'Travel or logistics', 'Other'];
const needs = ['none','soon','week','urgent'];
const areaKeys = ['studies','housing','social','health','money'];
const ratings = ['good','ok','difficult'];
const statuses = ['open','in progress','resolved'];
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const madridDay = date => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const today = () => madridDay(new Date());
const shiftDay = (date,days) => new Date(Date.parse(date+'T12:00:00Z')+days*86400000).toISOString().slice(0,10);
// A student who still has not checked in gets a second email this many days after the first one.
const reminderFollowUpDays = 4;
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
const recordSql = 'SELECT f.*,s.name,s.destination,a.studies,a.housing,a.social,a.health,a.money FROM feedback f JOIN students s ON s.id=f.student_id LEFT JOIN checkin_areas a ON a.feedback_id=f.id';
const rowsSql = recordSql+' ORDER BY f.created_at DESC';
const all = async (db,sql,...args) => (await db.prepare(sql).bind(...args).all()).results;
const first = (db,sql,...args) => db.prepare(sql).bind(...args).first();
const run = (db,sql,...args) => db.prepare(sql).bind(...args).run();
// Same table as drizzle/0001_checkin_areas.sql, created here too so the app works even if that migration has not run yet.
const areasTableSql = `CREATE TABLE IF NOT EXISTS checkin_areas (
 feedback_id TEXT PRIMARY KEY REFERENCES feedback(id),
 studies TEXT NOT NULL, housing TEXT NOT NULL, social TEXT NOT NULL, health TEXT NOT NULL, money TEXT NOT NULL
)`;
// Consultant call calendar: same tables as drizzle/0002_consultant_calendar.sql.
// A slot is 'open' (bookable), 'booked' (by a student from an urgent check-in) or 'cancelled' (by staff; never re-offered).
const consultants = [['maria','Maria','+39 320 123 4567'],['francesco','Francesco','+39 331 234 5678'],['giorgia','Giorgia','+39 342 345 6789']];
const calendarSql = [
  'CREATE TABLE IF NOT EXISTS consultants (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL)',
  `CREATE TABLE IF NOT EXISTS slots (
 id TEXT PRIMARY KEY, consultant_id TEXT NOT NULL REFERENCES consultants(id),
 starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
 student_id TEXT REFERENCES students(id), feedback_id TEXT REFERENCES feedback(id),
 booked_at TEXT, cancelled_at TEXT
)`,
  "CREATE UNIQUE INDEX IF NOT EXISTS one_booking_per_checkin ON slots(feedback_id) WHERE status='booked'"
];
// Example availability (Italian time), created once when there are no slots yet.
const exampleTimes = {maria:['09:30','14:00'],francesco:['11:00','16:00'],giorgia:['10:00','15:30']};
const slotMinutes = 30;
function italianTime(date,time) {
  const [y,m,d]=date.split('-').map(Number), [h,mi]=time.split(':').map(Number);
  const wanted=Date.UTC(y,m-1,d,h,mi);
  let utc=wanted;
  for (let i=0;i<2;i++) {
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})
      .formatToParts(new Date(utc)).map(part=>[part.type,part.value]));
    utc+=wanted-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);
  }
  return new Date(utc).toISOString();
}
// Start times ('HH:MM') of back-to-back calls of `minutes` that fit between `from` and `to`.
function rangeTimes(from,to,minutes) {
  const toMinutes=value=>{const [h,m]=value.split(':').map(Number);return h*60+m;};
  const times=[];
  for (let m=toMinutes(from); m+minutes<=toMinutes(to); m+=minutes) times.push(String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'));
  return times;
}
const validTime = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const callLengths = [15,30,45,60];
const maxSlotsPerAdd = 24;
function exampleSlots(from) {
  const days=[];
  for (let date=shiftDay(from,1); days.length<3; date=shiftDay(date,1)) {
    const weekday=new Date(date+'T12:00:00Z').getUTCDay();
    if (weekday!==0 && weekday!==6) days.push(date);
  }
  return days.flatMap(date=>consultants.flatMap(([consultant])=>exampleTimes[consultant].map(time=>{
    const starts=italianTime(date,time);
    return {id:consultant+'-'+date+'-'+time.replace(':',''),consultant,starts,ends:new Date(Date.parse(starts)+slotMinutes*60000).toISOString()};
  })));
}
async function setupSchema(db) {
  for (const sql of [areasTableSql,...calendarSql]) await run(db,sql);
  for (const [key,name,phone] of consultants) await run(db,'INSERT OR IGNORE INTO consultants (id,name,phone) VALUES (?,?,?)',key,name,phone);
  if (await first(db,'SELECT 1 AS found FROM slots LIMIT 1')) return;
  for (const slot of exampleSlots(today()))
    await run(db,"INSERT OR IGNORE INTO slots (id,consultant_id,starts_at,ends_at,status) VALUES (?,?,?,?,'open')",slot.id,slot.consultant,slot.starts,slot.ends);
}
let schemaReady;
const ensureSchema = db => schemaReady ??= setupSchema(db).catch(error => { schemaReady = undefined; throw error; });
const slotSql = 'SELECT s.*,c.name AS consultant_name,c.phone AS consultant_phone FROM slots s JOIN consultants c ON c.id=s.consultant_id';
const calendarRowsSql = `SELECT s.id,s.starts_at,s.ends_at,s.status,s.feedback_id,s.booked_at,s.cancelled_at,
  c.name AS consultant_name,c.phone AS consultant_phone,st.name AS student_name,f.note
  FROM slots s JOIN consultants c ON c.id=s.consultant_id LEFT JOIN students st ON st.id=s.student_id LEFT JOIN feedback f ON f.id=s.feedback_id
  WHERE s.starts_at>=? ORDER BY s.starts_at,c.name`;
const bookingInfo = s => ({id:s.id,starts_at:s.starts_at,ends_at:s.ends_at,consultant_name:s.consultant_name,consultant_phone:s.consultant_phone});
// Books a future open slot for one urgent check-in. The conditional UPDATE means only one student can win a slot;
// the one_booking_per_checkin index means a check-in can hold at most one booked slot.
async function book(db,studentId,feedbackId,slotId) {
  const current=await first(db,slotSql+" WHERE s.feedback_id=? AND s.status='booked'",feedbackId);
  if (current) return {status:'booked',slot:bookingInfo(current)};
  try {
    await run(db,"UPDATE slots SET status='booked',student_id=?,feedback_id=?,booked_at=? WHERE id=? AND status='open' AND starts_at>?",studentId,feedbackId,now(),slotId,now());
  } catch {}
  const booked=await first(db,slotSql+" WHERE s.feedback_id=? AND s.status='booked'",feedbackId);
  return booked ? {status:'booked',slot:bookingInfo(booked)} : {status:'taken'};
}
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
  const signedIn=Boolean(request.headers.get('oai-authenticated-user-id'));
  const staff=signedIn && allow.includes(email);
  const automation=Boolean(env.JOB_SECRET && request.headers.get('authorization')==='Bearer '+env.JOB_SECRET);
  if (method==='POST' && !automation && request.headers.get('origin')!==url.origin) return fail('Invalid request origin.',403);

  if (path==='/api/demo') return fail('Demo data is handled in the browser.',404);
  if (!db) return fail('The CRM database is unavailable.',503);
  await ensureSchema(db);

  if (path==='/api/student' || path==='/api/submit' || path==='/api/slots' || path==='/api/book') {
    if (method!=='POST') return fail('Method unavailable.',405);
    const input = await request.json();
    const token = text(input.token);
    if (!/^[0-9a-f]{64}$/i.test(token)) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    const student = await first(db,'SELECT id,name,start_date,end_date FROM students WHERE token=?',token);
    if (!student) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    if (student.start_date>day || student.end_date<day) return fail('This check-in link is outside your program dates.',409);
    const existing=await first(db,"SELECT id FROM feedback WHERE student_id=? AND week=? AND kind='check-in'",student.id,week);
    if (path==='/api/student') return json({name:student.name,week,submitted:!!existing});
    if (path==='/api/slots') return json({slots:await all(db,`SELECT s.id,s.starts_at,s.ends_at,c.name AS consultant_name
      FROM slots s JOIN consultants c ON c.id=s.consultant_id WHERE s.status='open' AND s.starts_at>? ORDER BY s.starts_at,c.name LIMIT 60`,now())});
    if (path==='/api/book') {
      const checkIn=await first(db,"SELECT id FROM feedback WHERE id=? AND student_id=? AND kind='check-in' AND need='urgent' AND week=?",text(input.feedback_id),student.id,week);
      if (!checkIn) return fail('Calls can only be booked from an urgent check-in this week.',403);
      return json({booking:await book(db,student.id,checkIn.id,text(input.slot))});
    }
    const kind=input.kind, mood=Number(input.mood), need=input.need, topic=text(input.topic), note=text(input.note);
    const answers=areaKeys.map(key=>input[key]);
    if (!['check-in','message'].includes(kind) || !needs.includes(need) || (topic && !topics.includes(topic)) ||
        note.length>2000 || (kind==='check-in' && (!Number.isInteger(mood)||mood<1||mood>5)) ||
        (kind==='check-in' && !answers.every(value=>ratings.includes(value))) ||
        (kind==='message' && !note)) return fail('Please complete the required fields.');
    if (kind==='check-in' && existing) return fail('Your check-in for this week is already saved.',409);
    const submissionId=text(input.id);
    if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return fail('Reload the form and try again.');
    // Urgent request -> urgent; any other request, a message, low mood or a "Difficult" area -> follow-up.
    const difficult = kind==='check-in' && answers.includes('difficult');
    const priority = need==='urgent' ? 'urgent' : need!=='none'||kind==='message'||mood<=2||difficult ? 'follow' : 'routine';
    const result=await run(db,`INSERT OR IGNORE INTO feedback
      (id,student_id,week,kind,mood,need,topic,note,priority,status,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`,submissionId,student.id,week,kind,kind==='message'?null:mood,need,topic,note,priority,priority==='routine'?'resolved':'open',now());
    const saved=await first(db,'SELECT kind FROM feedback WHERE id=? AND student_id=?',submissionId,student.id);
    if (!saved) return fail('A check-in for this week already exists. Reload to send a separate message.',409);
    if (saved.kind==='check-in' && kind==='check-in')
      await run(db,'INSERT OR IGNORE INTO checkin_areas (feedback_id,studies,housing,social,health,money) VALUES (?,?,?,?,?,?)',submissionId,...answers);
    const record=await first(db,recordSql+' WHERE f.id=?',submissionId);
    if (result.meta.changes && env.SHEET_WEBHOOK_URL && env.WEBHOOK_SECRET)
      ctx.waitUntil(deliver(db,env.SHEET_WEBHOOK_URL,env.WEBHOOK_SECRET,feedbackEvent(record)).catch(()=>{}));
    // Optional call booking: only from an urgent weekly check-in that picked a slot.
    const booking = kind==='check-in' && need==='urgent' && saved.kind==='check-in' && text(input.slot)
      ? await book(db,student.id,submissionId,text(input.slot)) : null;
    return json({saved:true,priority:record.priority,booking});
  }

  if (path==='/api/jobs' && method==='POST' && (staff||automation)) {
    const origin=url.origin;
    const eligible=await all(db,`SELECT s.* FROM students s WHERE start_date<=? AND end_date>=?
      AND NOT EXISTS(SELECT 1 FROM feedback f WHERE f.student_id=s.id AND f.kind='check-in' AND f.week=?)
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='reminder:'||s.id||':'||? AND d.state='sent') LIMIT 25`,day,day,week,week);
    // Second email: the first one for this week went out at least 4 calendar days ago (Madrid time)
    // and the student still has not checked in. Sent at most once per student per week.
    const followUpBefore=shiftDay(day,-reminderFollowUpDays);
    const followUps=(await all(db,`SELECT s.*,d.updated_at AS first_sent FROM students s
      JOIN delivery d ON d.id='reminder:'||s.id||':'||? AND d.state='sent'
      WHERE s.start_date<=? AND s.end_date>=?
      AND NOT EXISTS(SELECT 1 FROM feedback f WHERE f.student_id=s.id AND f.kind='check-in' AND f.week=?)
      AND NOT EXISTS(SELECT 1 FROM delivery r WHERE r.id='reminder-2:'||s.id||':'||? AND r.state='sent')`,week,day,day,week,week))
      .filter(s=>madridDay(new Date(s.first_sent))<=followUpBefore).slice(0,25);
    const pending=await all(db,`${recordSql}
      WHERE NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='feedback:'||f.id AND d.state='sent') ORDER BY f.created_at LIMIT 25`);
    const reminder=(s,attempt)=>({id:(attempt===1?'reminder:':'reminder-2:')+s.id+':'+week,kind:'weekly-reminder',attempt,week,to:s.email,name:s.name,
      subject:attempt===1?'Your weekly Gobeyond check-in':'Reminder: your weekly Gobeyond check-in',
      message:attempt===1?'How has your week abroad been? Share a quick update with your Gobeyond team.'
        :'We haven’t received your check-in this week yet. It only takes a minute: let your Gobeyond team know how your week abroad is going.',
      link:origin+'/check-in#'+s.token});
    const outcomes=[];
    for(const [destination,events] of [
      [env.REMINDER_WEBHOOK_URL,[...eligible.map(s=>reminder(s,1)),...followUps.map(s=>reminder(s,2))]],
      [env.SHEET_WEBHOOK_URL,pending.map(feedbackEvent)]
    ]) {
      if (!destination || !env.WEBHOOK_SECRET) continue;
      outcomes.push(...await Promise.all(events.map(event=>deliver(db,destination,env.WEBHOOK_SECRET,event))));
    }
    return json({reminderConfigured:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),sheetConfigured:!!(env.SHEET_WEBHOOK_URL&&env.WEBHOOK_SECRET),
      sent:outcomes.filter(s=>s==='sent').length,failed:outcomes.filter(s=>s==='failed').length});
  }
  if (!staff) return fail(signedIn ? 'Staff access is required.' : 'Sign in to open the staff workspace.',signedIn ? 403 : 401);

  if (path==='/api/data' && method==='GET') {
    const [students,feedback,slots,consultantRows]=await Promise.all([all(db,rosterSql),all(db,rowsSql),all(db,calendarRowsSql,new Date(Date.now()-2*86400000).toISOString()),
      all(db,'SELECT id,name,phone FROM consultants ORDER BY name')]);
    const sheetUrl = typeof env.GOOGLE_SHEET_URL === 'string' &&
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]+\/edit$/.test(env.GOOGLE_SHEET_URL)
      ? env.GOOGLE_SHEET_URL : null;
    return json({students,feedback,slots,consultants:consultantRows,day,week,integrations:{
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
  if (path==='/api/appointments/cancel' && method==='POST') {
    const input=await request.json();
    const result=await run(db,"UPDATE slots SET status='cancelled',cancelled_at=? WHERE id=? AND status='booked'",now(),text(input.id));
    return result.meta.changes ? json({saved:true}) : fail('The appointment was not found or is already cancelled.',404);
  }
  // Staff add availability: back-to-back open slots for one consultant on one day (Italian time).
  if (path==='/api/slots/add' && method==='POST') {
    const input=await request.json();
    const consultant=await first(db,'SELECT id FROM consultants WHERE id=?',text(input.consultant_id));
    const date=text(input.date), from=text(input.from), to=text(input.to), minutes=Number(input.minutes);
    if (!consultant||!validDate(date)||!validTime(from)||!validTime(to)||!callLengths.includes(minutes)) return fail('Choose a consultant, a date and a time range.');
    if (to<=from) return fail('The end time must be after the start time.');
    const times=rangeTimes(from,to,minutes);
    if (!times.length) return fail('The time range is shorter than one call.');
    if (times.length>maxSlotsPerAdd) return fail('Add at most 24 times at once.');
    const added=times.map(time=>{const starts=italianTime(date,time);return {starts,ends:new Date(Date.parse(starts)+minutes*60000).toISOString()};});
    if (added[0].starts<=now()) return fail('Choose times in the future.');
    const overlap=await first(db,"SELECT 1 AS found FROM slots WHERE consultant_id=? AND status!='cancelled' AND starts_at<? AND ends_at>?",consultant.id,added.at(-1).ends,added[0].starts);
    if (overlap) return fail('Some of these times overlap with this consultant’s existing availability.',409);
    for (const slot of added) await run(db,"INSERT INTO slots (id,consultant_id,starts_at,ends_at,status) VALUES (?,?,?,?,'open')",id(),consultant.id,slot.starts,slot.ends);
    return json({saved:true,added:added.length},201);
  }
  // Staff remove an open slot. Booked or cancelled slots are never removed, so no booking is lost.
  if (path==='/api/slots/remove' && method==='POST') {
    const input=await request.json();
    const result=await run(db,"DELETE FROM slots WHERE id=? AND status='open'",text(input.id));
    return result.meta.changes ? json({saved:true}) : fail('This time was not found or is no longer open.',404);
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
