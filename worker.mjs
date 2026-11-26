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
const rosterSql = 'SELECT id,name,email,destination,start_date,end_date,token,phone,parent_email,language FROM students WHERE deleted_at IS NULL ORDER BY name';
const validPhone = value => /^[+()\d\s.-]{6,25}$/.test(value) && (value.match(/\d/g)||[]).length>=6;
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const studentLanguage = value => ['it','en'].includes(value) ? value : null;
// Feedback rows carry the student's name/destination and, for check-ins, the "How are these things going?" answers.
const feedbackWithStudent='SELECT f.*,s.name,s.destination,a.studies,a.housing,a.social,a.health,a.money FROM feedback f JOIN students s ON s.id=f.student_id LEFT JOIN checkin_areas a ON a.feedback_id=f.id';
const rowsSql=feedbackWithStudent+' WHERE f.deleted_at IS NULL AND s.deleted_at IS NULL ORDER BY f.created_at DESC';
const all = async (db,sql,...args) => (await db.prepare(sql).bind(...args).all()).results;
const first = (db,sql,...args) => db.prepare(sql).bind(...args).first();
const run = (db,sql,...args) => db.prepare(sql).bind(...args).run();
// Same table as drizzle/0004_checkin_areas.sql, created here too so the app works even if that migration has not run yet.
const areasTableSql = `CREATE TABLE IF NOT EXISTS checkin_areas (
 feedback_id TEXT PRIMARY KEY REFERENCES feedback(id),
 studies TEXT NOT NULL, housing TEXT NOT NULL, social TEXT NOT NULL, health TEXT NOT NULL, money TEXT NOT NULL
)`;
// Consultant call calendar: same tables as drizzle/0005_consultant_calendar.sql.
// A slot is 'open' (bookable), 'booked' (by a student from their weekly check-in) or 'cancelled' (by staff; never re-offered).
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
// End-of-journey final feedback: same table as drizzle/0006_final_feedback.sql.
// Topics = questions 4-9 of the form; travel is the only optional rating.
const finalTopics = ['housing','school','social','local_support','team_support','travel'];
const finalRequiredTopics = ['housing','school','social','local_support','team_support'];
const finalTopicNames = {housing:'Host family / boarding house',school:'School and teaching',social:'Friends',local_support:'Local Coordinator / Tutor',team_support:'Go Beyond team',travel:'Travel and arrival'};
const housingTypes = ['family','boarding','other'];
const finalOpensBefore = 3, finalClosesAfter = 30;   // days around the student's end date
const finalEmailDays = [0,4,10];                      // invitation, reminder, last reminder (days after the end date)
const finalTableSql = `CREATE TABLE IF NOT EXISTS final_feedback (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL UNIQUE REFERENCES students(id),
 overall INTEGER NOT NULL, recommend INTEGER NOT NULL, housing_type TEXT NOT NULL,
 housing INTEGER NOT NULL, housing_comment TEXT NOT NULL DEFAULT '',
 school INTEGER NOT NULL, school_comment TEXT NOT NULL DEFAULT '',
 social INTEGER NOT NULL, social_comment TEXT NOT NULL DEFAULT '',
 local_support INTEGER NOT NULL, local_support_comment TEXT NOT NULL DEFAULT '',
 team_support INTEGER NOT NULL, team_support_comment TEXT NOT NULL DEFAULT '',
 travel INTEGER, best TEXT NOT NULL DEFAULT '', improve TEXT NOT NULL DEFAULT '', advice TEXT NOT NULL DEFAULT '',
 share_consent INTEGER NOT NULL DEFAULT 0, future_contact INTEGER, language TEXT NOT NULL DEFAULT 'en',
 followup_id TEXT, submitted_at TEXT NOT NULL, deleted_at TEXT
)`;
const finalRowsSql = `SELECT ff.*,s.name,s.destination,s.email,s.end_date FROM final_feedback ff JOIN students s ON s.id=ff.student_id`;
const finalWindow = (student,day) => day<shiftDay(student.end_date,-finalOpensBefore) ? 'early' : day>shiftDay(student.end_date,finalClosesAfter) ? 'closed' : 'open';
// Final feedback emails are in the student's language; with none known yet, Italian and English together.
const finalTexts = {
  it:{subject:['Com’è andata la tua esperienza Go Beyond?','Promemoria: raccontaci la tua esperienza','Ultimo promemoria: il tuo feedback finale'],
    message:'Il tuo programma è terminato: in meno di 4 minuti puoi raccontarci com’è andata.'},
  en:{subject:['How was your Go Beyond experience?','Reminder: tell us about your experience','Last reminder: your final feedback'],
    message:'Your program has ended: tell us how it went in less than 4 minutes.'}};
const finalEvent = (s,attempt,origin) => {
  const n=Math.min(Number(attempt)||1,3)-1, lang=studentLanguage(s.language);
  const pick=part=>lang?(part==='subject'?finalTexts[lang].subject.at(n):finalTexts[lang].message)
    :(part==='subject'?finalTexts.it.subject.at(n)+' · '+finalTexts.en.subject.at(n):finalTexts.it.message+' · '+finalTexts.en.message);
  return {id:'final:'+s.id+':'+attempt,kind:'final-feedback',attempt,language:lang||'it+en',to:s.email,name:s.name,
    subject:pick('subject'),message:pick('message'),link:origin+'/final#'+s.token};
};
// Columns added after the first release. Added here (not in a migration) so it works whether or not the
// hosting platform runs migrations first; "duplicate column" means it is already there.
const addedColumns = [['students','phone','TEXT'],['students','parent_email','TEXT'],['students','language','TEXT'],
  ['students','anonymized_at','TEXT'],['consultants','email','TEXT'],['consultants','active','INTEGER NOT NULL DEFAULT 1'],
  ['slots','student_phone','TEXT'],['slots','cancelled_by','TEXT']];
// Who did what (same table as drizzle/0007_audit_log.sql).
const auditTableSql = `CREATE TABLE IF NOT EXISTS audit_log (
 id TEXT PRIMARY KEY, at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL,
 object_type TEXT NOT NULL, object_id TEXT, details TEXT NOT NULL DEFAULT ''
)`;
const audit = (db,actor,action,objectType,objectId,details='') =>
  run(db,'INSERT INTO audit_log (id,at,actor,action,object_type,object_id,details) VALUES (?,?,?,?,?,?,?)',id(),now(),actor||'staff',action,objectType,objectId||null,String(details).slice(0,300));
// Student details that staff add by hand (same tables as drizzle/0008_student_details.sql): passport, visa,
// host family / residence, school abroad, emergency contacts and other documents. Each detail is one row whose
// `data` holds the fields below as JSON, and it can carry one file (e.g. the passport scan) in student_files.
const field = (type,options={}) => ({type,max:type==='text'?300:254,...options});
const itemKinds = {
  passport:{label:'Passport',fields:{number:field('text',{max:30,required:true}),country:field('text',{max:60}),
    issued:field('date'),expires:field('date',{required:true}),notes:field('text',{max:500})}},
  visa:{label:'Visa',fields:{type:field('text',{max:60,required:true}),
    status:field('choice',{values:['to apply','applied','approved','refused','not needed'],required:true}),
    number:field('text',{max:40}),valid_from:field('date'),valid_until:field('date'),notes:field('text',{max:500})}},
  family:{label:'Host family / residence',fields:{type:field('choice',{values:['family','residence'],required:true}),
    name:field('text',{max:120,required:true}),address:field('text'),phone:field('phone'),email:field('email'),
    from:field('date'),notes:field('text',{max:1000})}},
  school:{label:'School',fields:{name:field('text',{max:150,required:true}),address:field('text'),contact:field('text',{max:120}),
    phone:field('phone'),email:field('email'),grade:field('text',{max:60}),from:field('date'),notes:field('text',{max:500})}},
  contact:{label:'Emergency contact',fields:{name:field('text',{max:100,required:true}),relationship:field('text',{max:60}),
    phone:field('phone',{required:true}),email:field('email'),notes:field('text',{max:300})}},
  document:{label:'Document',fields:{title:field('text',{max:120,required:true}),
    category:field('choice',{values:['insurance','school letter','medical','travel','consent form','other'],required:true}),
    expires:field('date'),link:field('url',{max:500}),notes:field('text',{max:500})}}
};
const itemsTableSql = [`CREATE TABLE IF NOT EXISTS student_items (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES students(id), kind TEXT NOT NULL, data TEXT NOT NULL,
 created_at TEXT NOT NULL, created_by TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
)`,'CREATE INDEX IF NOT EXISTS student_items_by_student ON student_items(student_id)',
`CREATE TABLE IF NOT EXISTS student_files (
 item_id TEXT PRIMARY KEY REFERENCES student_items(id), name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL,
 content TEXT NOT NULL, uploaded_at TEXT NOT NULL, uploaded_by TEXT NOT NULL
)`];
const itemsSql = `SELECT i.id,i.student_id,i.kind,i.data,i.created_at,i.created_by,i.updated_at,i.updated_by,
  f.name AS file_name,f.type AS file_type,f.size AS file_size
  FROM student_items i JOIN students s ON s.id=i.student_id LEFT JOIN student_files f ON f.item_id=i.id
  WHERE s.deleted_at IS NULL ORDER BY i.created_at`;
const maxItemsPerStudent = 40;
// Files are kept in the database as base64 text, so they stay small: 1 MB each (the staff page shrinks photos first).
const maxFileBytes = 1024*1024;
const fileTypes = {'application/pdf':'PDF','image/jpeg':'JPG','image/png':'PNG','image/webp':'WEBP','image/heic':'HEIC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'Word'};
function itemData(kind,input) {
  const spec=itemKinds[kind];
  if (!spec) return {error:'Choose what to add.'};
  const data={};
  for (const [name,rule] of Object.entries(spec.fields)) {
    const value=text(input?.[name]);
    if (!value) { if (rule.required) return {error:'Fill in the required fields.'}; continue; }
    if (value.length>rule.max) return {error:'One of the answers is too long.'};
    if (rule.type==='date' && !validDate(value)) return {error:'Check the dates.'};
    if (rule.type==='phone' && !validPhone(value)) return {error:'Check the phone number.'};
    if (rule.type==='email' && !validEmail(value)) return {error:'Check the email address.'};
    if (rule.type==='url' && !/^https:\/\/\S+$/i.test(value)) return {error:'Links must start with https://'};
    if (rule.type==='choice' && !rule.values.includes(value)) return {error:'Choose one of the options.'};
    data[name]=rule.type==='email'?value.toLowerCase():value;
  }
  if ((data.issued && data.expires && data.issued>data.expires) || (data.valid_from && data.valid_until && data.valid_from>data.valid_until))
    return {error:'Check the dates.'};
  return {data};
}
function itemFile(input) {
  if (input==null) return {file:null};
  const name=text(input.name).replace(/[\\/:*?"<>|\u0000-\u001f]/g,'_').slice(0,120);
  const type=text(input.type).toLowerCase();
  const content=typeof input.content==='string'?input.content:'';
  if (!name || !fileTypes[type] || !content || content.length%4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(content))
    return {error:'Attach a PDF, JPG, PNG, WEBP, HEIC or Word file.'};
  const size=content.length/4*3-(content.endsWith('==')?2:content.endsWith('=')?1:0);
  if (size>maxFileBytes) return {error:'The file is too large (maximum 1 MB).'};
  return {file:{name,type,size,content}};
}
// Checks one detail coming from the staff page; returns {kind,data,file} or {error}.
function checkItem(input) {
  const kind=text(input?.kind);
  const {data,error}=itemData(kind,input?.data);
  if (error) return {error};
  const upload=itemFile(input.file);
  return upload.error ? {error:upload.error} : {kind,data,file:upload.file};
}
async function storeItem(db,actor,student,item,itemId=null,removeFile=false) {
  const at=now();
  if (itemId) await run(db,'UPDATE student_items SET data=?,updated_at=?,updated_by=? WHERE id=?',JSON.stringify(item.data),at,actor,itemId);
  else {
    itemId=id();
    await run(db,'INSERT INTO student_items (id,student_id,kind,data,created_at,created_by,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?)',
      itemId,student.id,item.kind,JSON.stringify(item.data),at,actor,at,actor);
  }
  if (item.file || removeFile) await run(db,'DELETE FROM student_files WHERE item_id=?',itemId);
  if (item.file) await run(db,'INSERT INTO student_files (item_id,name,type,size,content,uploaded_at,uploaded_by) VALUES (?,?,?,?,?,?,?)',
    itemId,item.file.name,item.file.type,item.file.size,item.file.content,at,actor);
  return itemId;
}
const itemLabel = (kind,data) => itemKinds[kind].label+(data.title||data.name||data.type?' · '+(data.title||data.name||data.type):'');
async function setupSchema(db) {
  for (const sql of [areasTableSql,...calendarSql,finalTableSql,auditTableSql,...itemsTableSql]) await run(db,sql);
  for (const [table,column,type] of addedColumns) {
    try { await run(db,`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`); }
    catch (error) { if (!/duplicate column/i.test(String(error?.message||error))) throw error; }
  }
  for (const [key,name,phone] of consultants) await run(db,'INSERT OR IGNORE INTO consultants (id,name,phone) VALUES (?,?,?)',key,name,phone);
  if (await first(db,'SELECT 1 AS found FROM slots LIMIT 1')) return;
  for (const slot of exampleSlots(today()))
    await run(db,"INSERT OR IGNORE INTO slots (id,consultant_id,starts_at,ends_at,status) VALUES (?,?,?,?,'open')",slot.id,slot.consultant,slot.starts,slot.ends);
}
let schemaReady;
const ensureSchema = db => schemaReady ??= setupSchema(db).catch(error => { schemaReady = undefined; throw error; });
const slotSql = 'SELECT s.*,c.name AS consultant_name,c.phone AS consultant_phone,c.email AS consultant_email FROM slots s JOIN consultants c ON c.id=s.consultant_id';
const calendarRowsSql = `SELECT s.id,s.consultant_id,s.starts_at,s.ends_at,s.status,s.feedback_id,s.booked_at,s.cancelled_at,s.cancelled_by,s.student_phone,
  c.name AS consultant_name,c.phone AS consultant_phone,st.name AS student_name,f.note
  FROM slots s JOIN consultants c ON c.id=s.consultant_id LEFT JOIN students st ON st.id=s.student_id LEFT JOIN feedback f ON f.id=s.feedback_id
  WHERE s.starts_at>=? ORDER BY s.starts_at,c.name`;
const bookingInfo = s => ({id:s.id,starts_at:s.starts_at,ends_at:s.ends_at,consultant_name:s.consultant_name,consultant_phone:s.consultant_phone});
// Books a future open slot for one weekly check-in (any support answer). The conditional UPDATE means only one
// student can win a slot; the one_booking_per_checkin index means a check-in can hold at most one booked slot.
// `fresh` = this call made the booking (so a confirmation email goes out once). The student's phone is kept
// on the slot and on their record so the consultant can call them. A booked call always needs staff attention,
// so a check-in that was routine ("No, all good") becomes an open follow-up.
async function book(db,studentId,feedbackId,slotId,phone) {
  const current=await first(db,slotSql+" WHERE s.feedback_id=? AND s.status='booked'",feedbackId);
  if (current) return {status:'booked',slot:bookingInfo(current)};
  let changes=0;
  try {
    changes=(await run(db,`UPDATE slots SET status='booked',student_id=?,feedback_id=?,booked_at=?,student_phone=?
      WHERE id=? AND status='open' AND starts_at>? AND consultant_id IN (SELECT id FROM consultants WHERE active=1)`,
      studentId,feedbackId,now(),phone,slotId,now())).meta.changes;
  } catch {}
  const booked=await first(db,slotSql+" WHERE s.feedback_id=? AND s.status='booked'",feedbackId);
  if (booked && changes) {
    await run(db,'UPDATE students SET phone=? WHERE id=?',phone,studentId);
    await run(db,"UPDATE feedback SET priority='follow',status='open' WHERE id=? AND priority='routine'",feedbackId);
  }
  return booked ? {status:'booked',slot:bookingInfo(booked),fresh:!!changes,raw:booked} : {status:'taken'};
}
// Call booked / cancelled email for the student (consultant in cc), with a calendar invite in Italian time.
const icsStamp = iso => iso.replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function callEvent(kind,slot,student) {
  const it=(student.language||'it')==='it';
  const when=new Intl.DateTimeFormat(it?'it-IT':'en-GB',{timeZone:'Europe/Rome',weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(slot.starts_at));
  const booked=kind==='booked';
  const subject=booked?(it?`Chiamata prenotata con ${slot.consultant_name}`:`Call booked with ${slot.consultant_name}`)
    :(it?`Chiamata annullata con ${slot.consultant_name}`:`Call cancelled with ${slot.consultant_name}`);
  const message=booked
    ?(it?`La tua chiamata con ${slot.consultant_name} è ${when} (ora italiana). Telefono del consulente: ${slot.consultant_phone}.`
      :`Your call with ${slot.consultant_name} is on ${when} (Italian time). Consultant’s phone: ${slot.consultant_phone}.`)
    :(it?`La chiamata di ${when} (ora italiana) è stata annullata. Il tuo team Gobeyond ti contatterà.`
      :`The call on ${when} (Italian time) has been cancelled. Your Gobeyond team will contact you.`);
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Go Beyond//Student Care//EN',`METHOD:${booked?'REQUEST':'CANCEL'}`,'BEGIN:VEVENT',
    `UID:${slot.id}@gobeyond-student-care`,`DTSTAMP:${icsStamp(now())}`,`DTSTART:${icsStamp(slot.starts_at)}`,`DTEND:${icsStamp(slot.ends_at)}`,
    `SUMMARY:Go Beyond – ${slot.consultant_name}`,`DESCRIPTION:${slot.consultant_name} ${slot.consultant_phone}`,
    `STATUS:${booked?'CONFIRMED':'CANCELLED'}`,`SEQUENCE:${booked?0:1}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
  return {id:`call-${kind}:${slot.id}:${booked?slot.booked_at:slot.cancelled_at}`,kind:'call-'+kind,language:it?'it':'en',
    to:student.email,cc:slot.consultant_email||null,name:student.name,consultant:slot.consultant_name,consultant_phone:slot.consultant_phone,
    student_phone:slot.student_phone||null,starts_at:slot.starts_at,ends_at:slot.ends_at,subject,message,ics};
}
const mailerFor = env => env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET ? {url:env.REMINDER_WEBHOOK_URL,secret:env.WEBHOOK_SECRET} : null;
// Privacy rule: once RETENTION_MONTHS have passed after a program, the student's personal details and written
// answers are removed; ratings stay for the statistics.
async function anonymize(db,studentId) {
  await run(db,`UPDATE students SET name='Former student', email='removed-'||id||'@invalid', token=?, phone=NULL, parent_email=NULL, anonymized_at=?
    WHERE id=? AND anonymized_at IS NULL`,id().replaceAll('-','')+id().replaceAll('-',''),now(),studentId);
  await run(db,"UPDATE feedback SET note='' WHERE student_id=?",studentId);
  await run(db,"UPDATE feedback_edits SET previous_note='' WHERE feedback_id IN (SELECT id FROM feedback WHERE student_id=?)",studentId);
  await run(db,`UPDATE final_feedback SET housing_comment='',school_comment='',social_comment='',local_support_comment='',team_support_comment='',
    best='',improve='',advice='' WHERE student_id=?`,studentId);
  await run(db,'UPDATE slots SET student_phone=NULL WHERE student_id=?',studentId);
  // Passport, visa, family, school, contacts and documents are personal details: removed completely.
  await run(db,'DELETE FROM student_files WHERE item_id IN (SELECT id FROM student_items WHERE student_id=?)',studentId);
  await run(db,'DELETE FROM student_items WHERE student_id=?',studentId);
}
const monthsBefore = (date,months) => { const [y,m,d]=date.split('-').map(Number); return new Date(Date.UTC(y,m-1-months,d,12)).toISOString().slice(0,10); };
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

// Urgent request -> urgent; any other request for support (not urgent / contact me this week), a message,
// low mood or a "difficult" area in the check-in -> follow-up.
function priorityFor(kind,mood,need,difficult=false) {
  if (need==='urgent') return 'urgent';
  if (need!=='none' || kind==='message' || mood<=2 || difficult) return 'follow';
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
  await ensureSchema(db);
  if (path==='/api/staff/sign-in' && method==='POST') return staffSignIn(request,env,allow);
  const session=browserSession(request);
  if (path==='/api/staff/sign-out' && method==='POST') {
    if (session) await run(db,'UPDATE staff_access SET session_digest=NULL WHERE session_digest=?',await digest(session));
    return Response.json({signedOut:true},{headers:{...headers,'set-cookie':staffCookieValue('',0)}});
  }

  if (path==='/api/student' || path==='/api/submit' || path==='/api/slots' || path==='/api/book') {
    if (method!=='POST') return fail('Method unavailable.',405);
    const input = await request.json();
    const token = text(input.token);
    if (!/^[0-9a-f]{64}$/i.test(token)) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    const student = await first(db,'SELECT id,name,email,start_date,end_date,phone,language FROM students WHERE token=? AND deleted_at IS NULL',token);
    if (!student) return fail('Ask your Gobeyond coordinator for your personal check-in link.',404);
    if (student.start_date>day || student.end_date<day) return fail('This check-in link is outside your program dates.',409);
    const existing=await first(db,"SELECT id FROM feedback WHERE student_id=? AND week=? AND kind='check-in' AND deleted_at IS NULL",student.id,week);
    // The language the student picks on the form is remembered for their emails.
    const language=studentLanguage(input.language);
    if (language && language!==student.language && path!=='/api/slots') {
      await run(db,'UPDATE students SET language=? WHERE id=?',language,student.id);
      student.language=language;
    }
    if (path==='/api/student') {
      // This week's check-in without a booked call lets the student book one later from the same link.
      const checkIn=await first(db,`SELECT f.id,EXISTS(SELECT 1 FROM slots s WHERE s.feedback_id=f.id AND s.status='booked') AS booked
        FROM feedback f WHERE f.student_id=? AND f.week=? AND f.kind='check-in' AND f.deleted_at IS NULL`,student.id,week);
      return json({name:student.name,week,submitted:!!existing,phone:student.phone||'',checkIn:checkIn?{id:checkIn.id,booked:!!checkIn.booked}:null});
    }
    // Open future slots of active consultants, plus every active consultant (all listed for a day, even with no times).
    if (path==='/api/slots') return json({
      slots:await all(db,`SELECT s.id,s.consultant_id,s.starts_at,s.ends_at,c.name AS consultant_name
        FROM slots s JOIN consultants c ON c.id=s.consultant_id WHERE s.status='open' AND c.active=1 AND s.starts_at>? ORDER BY s.starts_at,c.name LIMIT 500`,now()),
      consultants:await all(db,'SELECT id,name FROM consultants WHERE active=1 ORDER BY rowid')});
    const phone=text(input.phone);
    if (path==='/api/book') {
      const checkIn=await first(db,"SELECT id FROM feedback WHERE id=? AND student_id=? AND kind='check-in' AND week=? AND deleted_at IS NULL",text(input.feedback_id),student.id,week);
      if (!checkIn) return fail('Calls can be booked from this week’s check-in. Send your check-in first.',403);
      if (!validPhone(phone)) return fail('Enter a phone number so the consultant can call you.');
      const booking=await book(db,student.id,checkIn.id,text(input.slot),phone);
      const mailer=mailerFor(env);
      if (booking.fresh && mailer) ctx.waitUntil(deliver(db,mailer,callEvent('booked',booking.raw,student)).catch(()=>{}));
      return json({booking:{status:booking.status,slot:booking.slot}});
    }
    if (input.kind==='check-in' && text(input.slot) && !validPhone(phone))
      return fail('Enter a phone number so the consultant can call you.');
    const kind=input.kind, mood=Number(input.mood), need=input.need, topic=text(input.topic), note=text(input.note);
    const answers=areaKeys.map(key=>input[key]);
    if (!['check-in','message'].includes(kind) || !needs.includes(need) || (topic && !topics.includes(topic)) ||
        note.length>2000 || (kind==='check-in' && (!Number.isInteger(mood)||mood<1||mood>5)) ||
        (kind==='check-in' && !answers.every(value=>ratings.includes(value))) ||
        (kind==='message' && !note)) return fail('Please complete the required fields.');
    if (kind==='check-in' && existing) return fail('Your check-in for this week is already saved.',409);
    const submissionId=text(input.id);
    if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return fail('Reload the form and try again.');
    const difficult = kind==='check-in' && answers.includes('difficult');
    const priority=priorityFor(kind,mood,need,difficult);
    await run(db,`INSERT OR IGNORE INTO feedback
      (id,student_id,week,kind,mood,need,topic,note,priority,status,created_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM students WHERE id=? AND deleted_at IS NULL)`,
      submissionId,student.id,week,kind,kind==='message'?null:mood,need,topic,note,priority,priority==='routine'?'resolved':'open',now(),student.id);
    const saved=await first(db,'SELECT kind FROM feedback WHERE id=? AND student_id=? AND deleted_at IS NULL',submissionId,student.id);
    if (!saved) return fail('A check-in for this week already exists. Reload to send a separate message.',409);
    if (saved.kind==='check-in' && kind==='check-in')
      await run(db,'INSERT OR IGNORE INTO checkin_areas (feedback_id,studies,housing,social,health,money) VALUES (?,?,?,?,?,?)',submissionId,...answers);
    const record=await first(db,feedbackWithStudent+' WHERE f.id=? AND f.student_id=? AND f.deleted_at IS NULL AND s.deleted_at IS NULL',submissionId,student.id);
    if (!record) return fail('A check-in for this week already exists. Reload to send a separate message.',409);
    if (sheet) ctx.waitUntil(deliver(db,sheet,feedbackEvent(record)).catch(()=>{}));
    // Optional call booking: from any weekly check-in that picked a slot, whatever the support answer.
    const booking = kind==='check-in' && saved.kind==='check-in' && text(input.slot)
      ? await book(db,student.id,submissionId,text(input.slot),phone) : null;
    const mailer=mailerFor(env);
    if (booking?.fresh && mailer) ctx.waitUntil(deliver(db,mailer,callEvent('booked',booking.raw,student)).catch(()=>{}));
    const finalPriority=booking?.fresh && record.priority==='routine' ? 'follow' : record.priority;
    return json({saved:true,priority:finalPriority,booking:booking&&{status:booking.status,slot:booking.slot}});
  }

  // Final feedback form: the student's personal link on /final, open from 3 days before to 30 days after their end date.
  if (path==='/api/final' || path==='/api/final/submit') {
    if (method!=='POST') return fail('Method unavailable.',405);
    const input=await request.json() || {};
    const token=text(input.token);
    const student=/^[0-9a-f]{64}$/i.test(token)
      ? await first(db,'SELECT id,name,destination,email,end_date,language FROM students WHERE token=? AND deleted_at IS NULL',token) : null;
    if (!student) return fail('Ask your Gobeyond coordinator for your personal feedback link.',404);
    if (finalWindow(student,day)!=='open') return fail('The final feedback form is open from 3 days before to 30 days after the end of your program.',409);
    const pickedLanguage=studentLanguage(input.language);
    if (pickedLanguage && pickedLanguage!==student.language) await run(db,'UPDATE students SET language=? WHERE id=?',pickedLanguage,student.id);
    const done=await first(db,'SELECT id FROM final_feedback WHERE student_id=? AND deleted_at IS NULL',student.id);
    if (path==='/api/final') return json({name:student.name,destination:student.destination,submitted:!!done});
    if (done) return fail('You have already sent your final feedback. Thank you!',409);
    const whole=(value,lo,hi)=>{const n=Number(value);return value!==''&&value!=null&&Number.isInteger(n)&&n>=lo&&n<=hi?n:null;};
    const words=(value,max)=>{const s=text(value);return s.length<=max?s:null;};
    const given=value=>value!==undefined&&value!==null&&value!=='';
    const scores=Object.fromEntries(finalTopics.map(key=>[key,whole(input[key],1,5)]));
    const comments=Object.fromEntries(finalRequiredTopics.map(key=>[key,words(input[key+'_comment'],1000)]));
    const overall=whole(input.overall,1,5), recommend=whole(input.recommend,0,10);
    const best=words(input.best,2000), improve=words(input.improve,2000), advice=words(input.advice,2000);
    if (overall==null || recommend==null || !housingTypes.includes(input.housing_type) ||
        finalRequiredTopics.some(key=>scores[key]==null) || (given(input.travel) && scores.travel==null) ||
        Object.values(comments).some(value=>value==null) || best==null || improve==null || advice==null ||
        !['yes','no'].includes(input.share_consent) || (given(input.future_contact) && !['yes','no'].includes(input.future_contact)))
      return fail('Please complete the required fields.');
    // A 1 or 2 on questions 4-8 needs a comment and becomes a follow-up in the Support queue.
    const low=finalRequiredTopics.filter(key=>scores[key]<=2);
    if (low.some(key=>!comments[key])) return fail('Tell us what went wrong for each topic you rated 1 or 2.');
    const finalId=id();
    const saved=await run(db,`INSERT OR IGNORE INTO final_feedback (id,student_id,overall,recommend,housing_type,
      housing,housing_comment,school,school_comment,social,social_comment,local_support,local_support_comment,team_support,team_support_comment,
      travel,best,improve,advice,share_consent,future_contact,language,submitted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      finalId,student.id,overall,recommend,input.housing_type,
      scores.housing,comments.housing,scores.school,comments.school,scores.social,comments.social,
      scores.local_support,comments.local_support,scores.team_support,comments.team_support,
      scores.travel,best,improve,advice,input.share_consent==='yes'?1:0,given(input.future_contact)?(input.future_contact==='yes'?1:0):null,
      input.language==='it'?'it':'en',now());
    if (!saved.meta.changes) return fail('You have already sent your final feedback. Thank you!',409);
    if (low.length) {
      const followupId=id();
      const note=low.map(key=>`${finalTopicNames[key]} ${scores[key]}/5: ${comments[key]}`).join('\n');
      await run(db,`INSERT INTO feedback (id,student_id,week,kind,mood,need,topic,note,priority,status,created_at)
        VALUES (?,?,?,'final',NULL,'none','',?,'follow','open',?)`,followupId,student.id,week,note,now());
      await run(db,'UPDATE final_feedback SET followup_id=? WHERE id=?',followupId,finalId);
    }
    const record=await first(db,finalRowsSql+' WHERE ff.id=?',finalId);
    if (sheet) ctx.waitUntil(deliver(db,sheet,{id:'final-feedback:'+finalId,kind:'final-feedback',record}).catch(()=>{}));
    return json({saved:true,followup:low.length>0});
  }

  const access=session && env.STAFF_INVITE_SECRET
    ? await first(db,'SELECT email FROM staff_access WHERE session_digest=? AND expires_at>?',await digest(session),now())
    : null;
  const invitedStaff=!!access && allow.includes(access.email);
  const staff=nativeStaff || invitedStaff;
  const actor=nativeStaff ? email : access?.email || 'automation';
  if (path==='/api/jobs' && method==='POST' && (staff||automation)) {
    const origin=url.origin;
    const eligible=await all(db,`SELECT s.* FROM students s WHERE s.deleted_at IS NULL AND start_date<=? AND end_date>=?
      AND NOT EXISTS(SELECT 1 FROM feedback f WHERE f.student_id=s.id AND f.kind='check-in' AND f.week=? AND f.deleted_at IS NULL)
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='reminder:'||s.id||':'||? AND d.state='sent') LIMIT 25`,day,day,week,week);
    // Second email: the first one for this week went out at least 4 calendar days ago (Madrid time)
    // and the student still has not checked in. Sent at most once per student per week.
    const followUpBefore=shiftDay(day,-reminderFollowUpDays);
    const followUps=(await all(db,`SELECT s.*,d.updated_at AS first_sent FROM students s
      JOIN delivery d ON d.id='reminder:'||s.id||':'||? AND d.state='sent'
      WHERE s.deleted_at IS NULL AND s.start_date<=? AND s.end_date>=?
      AND NOT EXISTS(SELECT 1 FROM feedback f WHERE f.student_id=s.id AND f.kind='check-in' AND f.week=? AND f.deleted_at IS NULL)
      AND NOT EXISTS(SELECT 1 FROM delivery r WHERE r.id='reminder-2:'||s.id||':'||? AND r.state='sent')`,week,day,day,week,week))
      .filter(s=>madridDay(new Date(s.first_sent))<=followUpBefore).slice(0,25);
    const pending=await all(db,`${feedbackWithStudent}
      WHERE f.deleted_at IS NULL AND s.deleted_at IS NULL AND f.kind IN ('check-in','message')
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='feedback:'||f.id AND d.state='sent') ORDER BY f.created_at LIMIT 25`);
    // Final feedback emails: the invitation on the end date, then reminders 4 and 10 days later, each only after
    // the previous one went out (so a late start never sends them all at once), and none once the student answers.
    const finished=await all(db,`SELECT s.id,s.name,s.email,s.token,s.end_date,s.language FROM students s
      WHERE s.deleted_at IS NULL AND s.end_date<=? AND s.end_date>=?
      AND NOT EXISTS(SELECT 1 FROM final_feedback ff WHERE ff.student_id=s.id AND ff.deleted_at IS NULL)`,day,shiftDay(day,-finalClosesAfter));
    const finalSent=new Map((await all(db,"SELECT id,updated_at FROM delivery WHERE id LIKE 'final:%' AND state='sent'")).map(d=>[d.id,d.updated_at]));
    const finalDue=finished.flatMap(s=>{
      const next=[1,2,3].find(n=>!finalSent.has('final:'+s.id+':'+n));
      if (!next || day<shiftDay(s.end_date,finalEmailDays.at(next-1))) return [];
      if (next>1) {
        const previous=finalSent.get('final:'+s.id+':'+(next-1));
        if (madridDay(new Date(previous))>shiftDay(day,-(finalEmailDays.at(next-1)-finalEmailDays.at(next-2)))) return [];
      }
      return [finalEvent(s,next,url.origin)];
    }).slice(0,25);
    const pendingFinal=await all(db,`${finalRowsSql} WHERE ff.deleted_at IS NULL
      AND NOT EXISTS(SELECT 1 FROM delivery d WHERE d.id='final-feedback:'||ff.id AND d.state='sent') ORDER BY ff.submitted_at LIMIT 25`);
    // Weekly emails in the student's language (Italian until the student picks English on a form).
    const weeklyTexts={
      it:['Il tuo check-in settimanale Gobeyond','Promemoria: il tuo check-in settimanale Gobeyond',
        'Com’è andata la tua settimana all’estero? Raccontalo in breve al tuo team Gobeyond.',
        'Non abbiamo ancora ricevuto il tuo check-in di questa settimana. Ci vuole un minuto: fai sapere al tuo team Gobeyond come sta andando la tua settimana all’estero.'],
      en:['Your weekly Gobeyond check-in','Reminder: your weekly Gobeyond check-in',
        'How has your week abroad been? Share a quick update with your Gobeyond team.',
        'We haven’t received your check-in this week yet. It only takes a minute: let your Gobeyond team know how your week abroad is going.']};
    const reminder=(s,attempt)=>{
      const lang=studentLanguage(s.language)||'it', texts=weeklyTexts[lang];
      return {id:(attempt===1?'reminder:':'reminder-2:')+s.id+':'+week,kind:'weekly-reminder',attempt,week,language:lang,to:s.email,name:s.name,
        subject:texts.at(attempt-1),message:texts.at(attempt+1),link:origin+'/check-in#'+s.token};
    };
    // Privacy rule (RETENTION_MONTHS): clear personal details of students whose program ended that long ago.
    const retention=Number(env.RETENTION_MONTHS);
    let anonymized=0;
    if (Number.isInteger(retention) && retention>0) {
      for (const old of await all(db,'SELECT id FROM students WHERE anonymized_at IS NULL AND end_date<? LIMIT 25',monthsBefore(day,retention))) {
        await anonymize(db,old.id); anonymized++;
      }
    }
    const outcomes=[];
    for(const [destination,events] of [
      [env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET?{url:env.REMINDER_WEBHOOK_URL,secret:env.WEBHOOK_SECRET}:null,
        [...eligible.map(s=>reminder(s,1)),...followUps.map(s=>reminder(s,2)),...finalDue]],
      [sheet,[...pending.map(feedbackEvent),...pendingFinal.map(record=>({id:'final-feedback:'+record.id,kind:'final-feedback',record}))]]
    ]) {
      if (!destination) continue;
      outcomes.push(...await Promise.all(events.map(event=>deliver(db,destination,event))));
    }
    return json({reminderConfigured:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),sheetConfigured:!!sheet,anonymized,
      sent:outcomes.filter(s=>s==='sent').length,failed:outcomes.filter(s=>s==='failed').length});
  }
  if (!staff) return fail(signedIn ? 'Staff access is required.' : 'Sign in to open the staff workspace.',signedIn ? 403 : 401);

  if (path==='/api/data' && method==='GET') {
    const [students,feedback,deletedStudents,deletedFeedback,slots,consultantRows,finalFeedback,finalDeliveries]=await Promise.all([
      all(db,rosterSql),all(db,rowsSql),
      all(db,'SELECT id,name,email,destination,start_date,end_date,deleted_at FROM students WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'),
      all(db,feedbackWithStudent+' WHERE f.deleted_at IS NOT NULL AND s.deleted_at IS NULL ORDER BY f.deleted_at DESC'),
      all(db,calendarRowsSql,new Date(Date.now()-2*86400000).toISOString()),
      all(db,'SELECT id,name,phone,email,active FROM consultants ORDER BY rowid'),
      all(db,finalRowsSql+' WHERE ff.deleted_at IS NULL AND s.deleted_at IS NULL ORDER BY ff.submitted_at DESC'),
      all(db,"SELECT id FROM delivery WHERE id LIKE 'final:%' AND state='sent'")
    ]);
    const activity=await all(db,'SELECT at,actor,action,object_type,object_id,details FROM audit_log ORDER BY at DESC LIMIT 60');
    // Details without file contents (files are downloaded one at a time from /api/items/file).
    const items=(await all(db,itemsSql)).map(row=>({...row,data:JSON.parse(row.data||'{}')}));
    const retentionMonths=Number.isInteger(Number(env.RETENTION_MONTHS))&&Number(env.RETENTION_MONTHS)>0?Number(env.RETENTION_MONTHS):null;
    const finalInvited=[...new Set(finalDeliveries.map(d=>d.id.split(':').at(1)))];
    const sheetUrl = typeof env.GOOGLE_SHEET_URL === 'string' &&
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]+\/edit$/.test(env.GOOGLE_SHEET_URL)
      ? env.GOOGLE_SHEET_URL : null;
    return json({students,feedback,deletedStudents,deletedFeedback,slots,consultants:consultantRows,finalFeedback,finalInvited,activity,items,day,week,staffSession:invitedStaff,integrations:{
      sheet:!!sheet, sheetUrl, retentionMonths,
      reminder:!!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET),
      reminderScheduled:env.WEEKLY_EMAIL_SCHEDULE==='daily'}});
  }
  if ((path==='/api/students' || path==='/api/students/update') && method==='POST') {
    const input=await request.json() || {};
    const name=text(input.name), address=text(input.email).toLowerCase(), destination=text(input.destination), start=text(input.start_date), end=text(input.end_date);
    if (!name||name.length>100||!destination||destination.length>120||address.length>254||
      !validEmail(address)||!validDate(start)||!validDate(end)||start>end) return fail('Check the student details and program dates.');
    // Optional: student phone, parent email (emergencies only, never used for forms) and email language.
    const phone=text(input.phone), parentEmail=text(input.parent_email).toLowerCase(), language=studentLanguage(input.language);
    if (phone && !validPhone(phone)) return fail('Check the phone number.');
    if (parentEmail && (!validEmail(parentEmail)||parentEmail.length>254)) return fail('Check the parent email address.');
    const token=id().replaceAll('-','')+id().replaceAll('-','');
    if (path==='/api/students/update') {
      const studentId=text(input.id);
      const result=await run(db,`UPDATE OR IGNORE students SET name=?, email=?, destination=?, start_date=?, end_date=?,
        phone=?, parent_email=?, language=?, token=CASE WHEN email<>? THEN ? ELSE token END WHERE id=? AND deleted_at IS NULL`,
        name,address,destination,start,end,phone||null,parentEmail||null,language,address,token,studentId);
      if (result.meta.changes) { await audit(db,actor,'student edited','student',studentId,name); return json({saved:true}); }
      const existing=await first(db,'SELECT id FROM students WHERE id=? AND deleted_at IS NULL',studentId);
      return existing ? fail('This student email already exists.',409) : fail('The student record was not found.',404);
    }
    // Optional details added together with the student (passport, visa, family, school, contacts, documents):
    // all are checked before anything is saved.
    const items=Array.isArray(input.items)?input.items:[];
    if (items.length>maxItemsPerStudent) return fail('Too many details at once.');
    const checked=items.map(checkItem);
    const invalid=checked.find(item=>item.error);
    if (invalid) return fail(invalid.error);
    const studentId=id();
    const result=await run(db,'INSERT OR IGNORE INTO students (id,name,email,destination,start_date,end_date,token,phone,parent_email,language) VALUES (?,?,?,?,?,?,?,?,?,?)',
      studentId,name,address,destination,start,end,token,phone||null,parentEmail||null,language);
    if (result.meta.changes) {
      await audit(db,actor,'student added','student',studentId,name);
      for (const item of checked) {
        const itemId=await storeItem(db,actor,{id:studentId},item);
        await audit(db,actor,'detail added','student item',itemId,itemLabel(item.kind,item.data)+' · '+name);
      }
      return json({saved:true,id:studentId},201);
    }
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
    if (result.meta.changes) {
      const label=table==='students'?(await first(db,'SELECT name FROM students WHERE id=?',recordId))?.name
        :(await first(db,'SELECT s.name FROM feedback f JOIN students s ON s.id=f.student_id WHERE f.id=?',recordId))?.name;
      await audit(db,actor,(table==='students'?'student ':'response ')+(deleting?'deleted':'restored'),table==='students'?'student':'feedback',recordId,label||'');
      return json({saved:true});
    }
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
    // Editing keeps the student's "How are these things going?" answers, so a "difficult" area still counts.
    const difficult=kind==='check-in' && !!await first(db,"SELECT 1 AS found FROM checkin_areas WHERE feedback_id=? AND 'difficult' IN (studies,housing,social,health,money)",recordId);
    const priority=priorityFor(kind,mood,need,difficult);
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
    await audit(db,actor,'response edited','feedback',recordId);
    return json({saved:true});
  }
  if (path==='/api/status' && method==='POST') {
    const input=await request.json();
    if (!statuses.includes(input.status)||typeof input.id!=='string') return fail('Choose a valid status.');
    const result=await run(db,'UPDATE feedback SET status=? WHERE id=? AND deleted_at IS NULL AND student_id IN (SELECT id FROM students WHERE deleted_at IS NULL)',input.status,input.id);
    if (result.meta.changes) await audit(db,actor,'status changed','feedback',input.id,input.status);
    return result.meta.changes ? json({saved:true}) : fail('The feedback record was not found.',404);
  }
  if (path==='/api/appointments/cancel' && method==='POST') {
    const input=await request.json();
    const slotId=text(input.id);
    const result=await run(db,"UPDATE slots SET status='cancelled',cancelled_at=?,cancelled_by=? WHERE id=? AND status='booked'",now(),actor,slotId);
    if (!result.meta.changes) return fail('The appointment was not found or is already cancelled.',404);
    const slot=await first(db,slotSql+' WHERE s.id=?',slotId);
    const student=await first(db,'SELECT name,email,language FROM students WHERE id=?',slot.student_id);
    await audit(db,actor,'call cancelled','slot',slotId,`${slot.consultant_name} ${slot.starts_at} ${student?.name||''}`);
    const mailer=mailerFor(env);
    if (mailer && student) ctx.waitUntil(deliver(db,mailer,callEvent('cancelled',slot,student)).catch(()=>{}));
    return json({saved:true});
  }
  // Staff add, edit and deactivate consultants. Inactive consultants are hidden from students and from new availability.
  if (path==='/api/consultants/save' && method==='POST') {
    const input=await request.json() || {};
    const name=text(input.name), phone=text(input.phone), mail=text(input.email).toLowerCase(), active=input.active===false||input.active===0?0:1;
    if (!name||name.length>60||!validPhone(phone)||(mail&&!validEmail(mail))) return fail('Check the consultant’s name, phone and email.');
    let consultantId=text(input.id);
    if (consultantId) {
      const result=await run(db,'UPDATE consultants SET name=?,phone=?,email=?,active=? WHERE id=?',name,phone,mail||null,active,consultantId);
      if (!result.meta.changes) return fail('The consultant was not found.',404);
    } else {
      consultantId=(name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'consultant')+'-'+id().slice(0,4);
      await run(db,'INSERT INTO consultants (id,name,phone,email,active) VALUES (?,?,?,?,?)',consultantId,name,phone,mail||null,active);
    }
    await audit(db,actor,'consultant saved','consultant',consultantId,`${name}${active?'':' (inactive)'}`);
    return json({saved:true,id:consultantId});
  }
  // Recurring availability: the chosen weekdays and time blocks (default 09:00-12:30 and 14:00-18:00) for a number of
  // weeks. Times in the past or overlapping existing open/booked times are skipped, not refused.
  if (path==='/api/slots/recurring' && method==='POST') {
    const input=await request.json() || {};
    const active=(await all(db,'SELECT id FROM consultants WHERE active=1')).map(c=>c.id);
    const chosen=input.consultant_id==='all' ? active : [text(input.consultant_id)].filter(c=>active.includes(c));
    const weekdays=[...new Set((Array.isArray(input.weekdays)?input.weekdays:[]).map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=7))];
    const blocks=(Array.isArray(input.blocks)?input.blocks:[]).filter(b=>b&&validTime(b.from)&&validTime(b.to)&&b.to>b.from);
    const minutes=Number(input.minutes), start=text(input.start_date), weeks=Number(input.weeks);
    if (!chosen.length||!weekdays.length||!blocks.length||!callLengths.includes(minutes)||!validDate(start)||!Number.isInteger(weeks)||weeks<1||weeks>12)
      return fail('Choose consultants, days, time blocks, a start date and a number of weeks.');
    const candidates=[];
    for (let offset=0; offset<weeks*7; offset++) {
      const date=shiftDay(start,offset), weekday=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7+1;
      if (!weekdays.includes(weekday)) continue;
      for (const block of blocks) for (const time of rangeTimes(block.from,block.to,minutes)) for (const consultant of chosen) {
        const starts=italianTime(date,time);
        candidates.push({consultant,starts,ends:new Date(Date.parse(starts)+minutes*60000).toISOString()});
      }
    }
    if (candidates.length>1500) return fail('That would add more than 1,500 times. Choose fewer weeks or time blocks.');
    const taken=await all(db,`SELECT consultant_id,starts_at,ends_at FROM slots WHERE status!='cancelled' AND ends_at>? AND consultant_id IN (${chosen.map(()=>'?').join(',')})`,now(),...chosen);
    let added=0, skipped=0;
    for (const slot of candidates) {
      if (slot.starts<=now() || taken.some(t=>t.consultant_id===slot.consultant&&t.starts_at<slot.ends&&t.ends_at>slot.starts)) { skipped++; continue; }
      await run(db,"INSERT INTO slots (id,consultant_id,starts_at,ends_at,status) VALUES (?,?,?,?,'open')",id(),slot.consultant,slot.starts,slot.ends);
      taken.push({consultant_id:slot.consultant,starts_at:slot.starts,ends_at:slot.ends});
      added++;
    }
    await audit(db,actor,'recurring availability added','slot',null,`${chosen.join(', ')} · ${blocks.map(b=>b.from+'-'+b.to).join(', ')} · weeks: ${weeks} · added: ${added}`);
    return json({saved:true,added,skipped},201);
  }
  // Remove the example times created on the first run (open ones only).
  if (path==='/api/slots/remove-examples' && method==='POST') {
    const examples=(await all(db,"SELECT id FROM slots WHERE status='open'")).filter(s=>/^(maria|francesco|giorgia)-\d{4}-\d\d-\d\d-\d{4}$/.test(s.id));
    let removed=0;
    for (const slot of examples) removed+=(await run(db,"DELETE FROM slots WHERE id=? AND status='open'",slot.id)).meta.changes;
    await audit(db,actor,'example times removed','slot',null,String(removed));
    return json({saved:true,removed});
  }
  // Staff add availability: back-to-back open slots for one consultant on one day (Italian time).
  if (path==='/api/slots/add' && method==='POST') {
    const input=await request.json();
    const consultant=await first(db,'SELECT id FROM consultants WHERE id=? AND active=1',text(input.consultant_id));
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
    await audit(db,actor,'availability added','slot',null,`${consultant.id} ${date} ${from}-${to}`);
    return json({saved:true,added:added.length},201);
  }
  // Staff remove an open slot. Booked or cancelled slots are never removed, so no booking is lost.
  if (path==='/api/slots/remove' && method==='POST') {
    const input=await request.json();
    const slot=await first(db,slotSql+" WHERE s.id=? AND s.status='open'",text(input.id));
    const result=await run(db,"DELETE FROM slots WHERE id=? AND status='open'",text(input.id));
    if (result.meta.changes) await audit(db,actor,'time removed','slot',text(input.id),slot?`${slot.consultant_name} ${slot.starts_at}`:'');
    return result.meta.changes ? json({saved:true}) : fail('This time was not found or is no longer open.',404);
  }
  // Staff send the final feedback invitation now (it counts as the scheduled invitation if that has not gone out yet).
  if (path==='/api/final/send' && method==='POST') {
    const input=await request.json() || {};
    const student=await first(db,'SELECT id,name,email,token,end_date,language FROM students WHERE id=? AND deleted_at IS NULL',text(input.id));
    if (!student) return fail('The student record was not found.',404);
    const window=finalWindow(student,day);
    if (window==='early') return fail('The final feedback form opens 3 days before the end of the program.',409);
    if (window==='closed') return fail('The final feedback form closed 30 days after the end of the program.',409);
    if (await first(db,'SELECT id FROM final_feedback WHERE student_id=? AND deleted_at IS NULL',student.id)) return fail('This student has already sent their final feedback.',409);
    if (!(env.REMINDER_WEBHOOK_URL&&env.WEBHOOK_SECRET)) return fail('Connect a reminder webhook to send emails.',409);
    const invited=await first(db,"SELECT id FROM delivery WHERE id=? AND state='sent'",'final:'+student.id+':1');
    const state=await deliver(db,{url:env.REMINDER_WEBHOOK_URL,secret:env.WEBHOOK_SECRET},finalEvent(student,invited?'manual-'+Date.now():1,url.origin));
    if (state==='sent') await audit(db,actor,'final feedback form sent','student',student.id,student.name);
    return state==='sent' ? json({sent:true}) : fail('The email could not be sent. Try again.',502);
  }
  // Student details: add or edit one (with an optional file), remove one, open its file.
  if (path==='/api/items/save' && method==='POST') {
    const input=await request.json() || {};
    const student=await first(db,'SELECT id,name FROM students WHERE id=? AND deleted_at IS NULL AND anonymized_at IS NULL',text(input.student_id));
    if (!student) return fail('The student record was not found.',404);
    const item=checkItem(input);
    if (item.error) return fail(item.error);
    const itemId=text(input.id);
    if (itemId) {
      if (!await first(db,'SELECT id FROM student_items WHERE id=? AND student_id=? AND kind=?',itemId,student.id,item.kind))
        return fail('This detail was not found. Reload the page and try again.',404);
    } else if ((await first(db,'SELECT COUNT(*) AS n FROM student_items WHERE student_id=?',student.id)).n>=maxItemsPerStudent)
      return fail('This student already has the maximum number of details.',409);
    const savedId=await storeItem(db,actor,student,item,itemId||null,input.remove_file===true);
    await audit(db,actor,itemId?'detail edited':'detail added','student item',savedId,itemLabel(item.kind,item.data)+' · '+student.name);
    return json({saved:true,id:savedId},itemId?200:201);
  }
  if (path==='/api/items/delete' && method==='POST') {
    const input=await request.json() || {};
    const item=await first(db,'SELECT i.id,i.kind,i.data,s.name FROM student_items i JOIN students s ON s.id=i.student_id WHERE i.id=? AND s.deleted_at IS NULL',text(input.id));
    if (!item) return fail('This detail was not found. Reload the page and try again.',404);
    await run(db,'DELETE FROM student_files WHERE item_id=?',item.id);
    await run(db,'DELETE FROM student_items WHERE id=?',item.id);
    await audit(db,actor,'detail removed','student item',item.id,itemLabel(item.kind,JSON.parse(item.data||'{}'))+' · '+item.name);
    return json({saved:true});
  }
  if (path==='/api/items/file' && method==='GET') {
    const file=await first(db,`SELECT f.name,f.type,f.content,i.id,i.kind,i.data,s.name AS student_name FROM student_files f
      JOIN student_items i ON i.id=f.item_id JOIN students s ON s.id=i.student_id WHERE f.item_id=? AND s.deleted_at IS NULL`,text(url.searchParams.get('id')));
    if (!file) return fail('This file was not found.',404);
    await audit(db,actor,'file opened','student item',file.id,itemLabel(file.kind,JSON.parse(file.data||'{}'))+' · '+file.student_name);
    const bytes=Uint8Array.from(atob(file.content),ch=>ch.charCodeAt(0));
    // Types come from a fixed list (never HTML or SVG); PDFs and photos open in the browser, the rest download.
    const inline=['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type);
    return new Response(bytes,{headers:{...headers,'content-type':file.type,
      'content-disposition':(inline?'inline':'attachment')+"; filename*=UTF-8''"+encodeURIComponent(file.name)}});
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
  // The weekly check-in also needs the five "How are these things going?" answers; without them
  // the student is sent to their full form.
  const submission={id:id(),token,kind:'check-in',mood:fields.get('mood'),
    need:fields.get('need'),topic:fields.get('topic'),note:fields.get('note'),
    ...Object.fromEntries(areaKeys.map(key=>[key,fields.get(key)]))};
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
  const name=url.pathname==='/'||url.pathname==='/check-in'||url.pathname==='/final' ? '/index.html' : url.pathname;
  const asset=Object.hasOwn(assets,name)&&assets[name];
  return asset ? new Response(asset.body,{headers:{...headers,'content-type':asset.type}}) : new Response('Page not found',{status:404,headers});
}};
