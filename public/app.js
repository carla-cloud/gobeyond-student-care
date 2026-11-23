const app=document.querySelector('#app');
const detail=document.querySelector('#detail');
const paths={
 overview:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 feedback:'M5 4h14v17H5z M9 8h6 M9 12h6 M9 16h4',
 students:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-4 M16 3a4 4 0 0 1 0 8',
 support:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M12 8v5 M12 17h.01',
 sheet:'M3 4h18v16H3z M3 9h18 M9 9v11 M15 9v11 M3 14h18',
 settings:'M4 7h16 M4 17h16 M8 4v6 M16 14v6',
 calendar:'M4 6h16v15H4z M4 10h16 M8 3v6 M16 3v6',
 clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M12 6v6l4 2',
 link:'M10 13l4-4 M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0 M16 8l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
 download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
 globe:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M2 12h20 M12 2c5 5 5 15 0 20-5-5-5-15 0-20',
 plane:'M22 2 9 15 M22 2l-6 20-5-9-9-5 20-6',
 plus:'M12 5v14 M5 12h14'
};
const icon=(name,size=18)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"/></svg>`;
const brand=`<a href="/" class="brand"><span class="logo">${icon('plane',21)}</span><span>gobeyond<small>International Education</small></span></a>`;
const moods=['','Struggling','Low','Okay','Good','Great'];
const faces=['','😟','🙁','😐','🙂','😄'];
const topics=['School','Host family or accommodation','Friends and settling in','Wellbeing','Travel or logistics','Other'];
const statuses=['open','in progress','resolved'];
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const capital=value=>value.charAt(0).toUpperCase()+value.slice(1);
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dateLabel=(value,options={day:'numeric',month:'short'})=>new Intl.DateTimeFormat('en-GB',{...options,timeZone:'Europe/Madrid'}).format(new Date(value.length===10?value+'T12:00:00Z':value));
const d=new Date(day+'T12:00:00Z');
d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
const currentWeek=d.toISOString().slice(0,10);
const weekEnd=new Date(d.getTime()+6*86400000).toISOString().slice(0,10);
const dateAfter=offset=>new Date(Date.parse(day+'T12:00:00Z')+offset*86400000).toISOString().slice(0,10);
const examples=[
 ['Sofia Rossi','Toronto, Canada',2,'soon','Host family or accommodation','I’m finding it hard to settle into the host family’s routine. Could we talk?'],
 ['Luca Bianchi','Dublin, Ireland',4,'none','School','My classes are going well and I joined the football team.'],
 ['Giulia Romano','Brighton, UK',1,'urgent','Wellbeing','I’m having a tough week and would like to speak to my coordinator.'],
 ['Emma Conti','Vancouver, Canada',5,'none','Friends and settling in','I made new friends on a school trip.'],
 ['Matteo Ricci','Auckland, New Zealand',3,'soon','School','Can you help me understand how to change one of my classes?'],
 ['Alice Marino','Boston, USA',4,'none','Other','I’m feeling a lot more at home this week.'],
 ['Leonardo Costa','Oxford, UK'],['Beatrice Gallo','Ottawa, Canada']
];
const exampleData=()=>({
 students:examples.map(([name,destination],i)=>({id:'sample-'+i,name,destination,email:'student'+i+'@example.com',start_date:dateAfter(-60),end_date:dateAfter(90)})),
 feedback:examples.slice(0,6).map(([name,destination,mood,need,topic,note],i)=>({
  id:'demo-'+i,student_id:'sample-'+i,name,destination,kind:'check-in',week:currentWeek,mood,need,topic,note,
  priority:need==='urgent'?'urgent':need==='soon'?'follow':'routine',status:i===4?'in progress':need==='none'?'resolved':'open',
  created_at:new Date(Date.now()-i*7200000).toISOString()
 })),day,week:currentWeek,integrations:{sheet:false,reminder:false}
});
const demoKey='gobeyond-demo-v1';
function readDemo(){
 try {const data=JSON.parse(localStorage.getItem(demoKey));if(data?.week===currentWeek) return data;}catch{}
 return exampleData();
}
function saveDemo(data){localStorage.setItem(demoKey,JSON.stringify(data));}
async function request(path,body){
 const response=await fetch(path,body===undefined?{}:{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 const value=await response.json().catch(()=>({error:'Unable to reach the CRM.'}));
 if(!response.ok) throw new Error(value.error||'Something went wrong.');
 return value;
}
function showError(form,error){form.querySelector('.error').textContent=error.message;}
function textField(label,name,type='text',extra=''){return `<label class="field">${label}<input name="${name}" type="${type}" required ${extra}></label>`;}
function options(values){return values.map(value=>`<option value="${esc(value)}">${esc(capital(value))}</option>`).join('');}
function avatar(name){return `<span class="avatar">${esc(name.split(' ').map(word=>word[0]).slice(0,2).join('').toUpperCase())}</span>`;}
function pill(r){return `<span class="pill ${r.status==='resolved'?'resolved':r.priority}">${r.status==='resolved'?'Resolved':r.priority==='urgent'?'Urgent':r.status==='in progress'?'In progress':r.priority==='follow'?'Follow-up':'Routine'}</span>`;}
function studentLink(s){return location.origin+'/check-in#'+s.token;}
const views=[['overview','Overview'],['feedback','Feedback'],['students','Students'],['support','Support queue'],['sheet','Spreadsheet'],['settings','Settings']];

let data,view='overview',demo=false,search='',filter='all',loadError='';
const active=()=>data.students.filter(s=>s.start_date<=data.day&&s.end_date>=data.day);
const current=()=>data.feedback.filter(r=>r.week===data.week&&r.kind==='check-in');
const queue=()=>data.feedback.filter(r=>r.priority!=='routine'&&r.status!=='resolved').sort((a,b)=>Number(b.priority==='urgent')-Number(a.priority==='urgent')||b.created_at.localeCompare(a.created_at));
const waiting=()=>active().filter(s=>!current().some(r=>r.student_id===s.id));
const person=r=>`<div class="person">${avatar(r.name)}<div><b>${esc(r.name)}</b><small>${esc(r.destination)}</small></div></div>`;
const rowButton=r=>`<button class="row-link" data-record="${esc(r.id)}">View</button>`;
const metric=(label,value,desc,i,color='')=>`<div class="metric"><div class="metric-top"><span class="tile ${color}">${icon(i)}</span>${label}</div><strong>${value}</strong><small>${desc}</small></div>`;
const title=(name,sub,buttons='')=>`<section class="intro"><div><h1>${name}</h1><p>${sub}</p></div><div class="actions">${buttons}</div></section>`;
const btn=(label,action,i,primary=false)=>`<button class="btn ${primary?'primary':''}" data-action="${action}">${i?icon(i,16):''}${label}</button>`;
const externalSheetLink=()=>data.integrations.sheetUrl
 ? `<a class="btn" href="${esc(data.integrations.sheetUrl)}" target="_blank" rel="noopener noreferrer">${icon('sheet',16)} Open Google Sheet</a>`
 : '';
const table=(head,rows,empty='No records to show.')=>rows.length?`<div class="table-wrap"><table><thead><tr>${head.map(h=>'<th>'+h+'</th>').join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`:`<p class="empty">${empty}</p>`;
const feedbackTable=(rows,full=false)=>table(full?['Student','Week of','Type','Mood','Topic','Status','']:['Student','Mood','Status',''],
 rows.map(r=>`<tr><td>${person(r)}</td>${full?`<td>${dateLabel(r.week)}</td><td>${r.kind==='message'?'Message':'Check-in'}</td>`:''}<td>${r.mood?faces[r.mood]+' '+moods[r.mood]:'—'}</td>${full?`<td>${esc(r.topic)||'—'}</td>`:''}<td>${pill(r)}</td><td>${rowButton(r)}</td></tr>`),'Feedback appears here as students submit check-ins and messages.');

function overview(){
 const count=active().length;
 const answered=count-waiting().length;
 const open=queue();
 return title('Student care overview','Track weekly feedback and follow up with students abroad.',
   btn('Export CSV','export','download')+`<a class="btn primary" href="/check-in?demo=1" target="_blank" rel="noopener">${icon('link',16)} Preview check-in</a>`)+
 `<section class="hero"><div><div class="eyebrow">${icon('globe',16)} Weekly check-ins</div><h2>How are your students doing?</h2><p>${count ? answered+' of '+count+' active students have checked in this week.' : 'Add a student to start collecting weekly feedback.'}</p></div><div class="week">${icon('calendar',16)}${dateLabel(data.week)} – ${dateLabel(weekEnd)}</div></section>
 <section class="metrics" aria-label="Weekly metrics">
 ${metric('Active students',count,'Currently abroad','students')}
 ${metric('Check-ins received',answered,count?Math.round(answered/count*100)+'% response rate':'This week','feedback','green')}
 ${metric('Awaiting response',waiting().length,'Due this week','clock','purple')}
 ${metric('Open follow-ups',open.length,open.filter(r=>r.priority==='urgent').length+' urgent','support','orange')}
 </section>
 <section class="grid">
 <div class="card"><div class="card-head"><div><h2>Recent feedback</h2><p>Latest check-ins and messages</p></div>${btn('View all','feedback')}</div>${feedbackTable(data.feedback.slice(0,5))}</div>
 <div class="card"><div class="card-head"><div><h2>Support queue</h2><p>Students who may need help</p></div></div><div class="queue">${open.length?open.slice(0,5).map(r=>`<button class="queue-item" data-record="${esc(r.id)}">${avatar(r.name)}<span class="copy"><b>${esc(r.name)}</b><small>${esc(r.topic||r.note||'Requested support')}</small></span>${pill(r)}</button>`).join(''):'<p class="empty">No open follow-ups.</p>'}</div></div>
 </section>`;
}
function dataView(){
 if(view==='overview') return overview();
 if(view==='students') return title('Students','Manage program dates and personal check-in links.',btn('Add student','add','plus',true))+
  `<section class="card"><div class="card-head"><h2>Student directory</h2></div>${table(['Student','Email','Program dates','This week',''],data.students.map(s=>`<tr><td>${person(s)}</td><td>${esc(s.email)}</td><td>${dateLabel(s.start_date)} – ${dateLabel(s.end_date)}</td><td><span class="pill ${current().some(r=>r.student_id===s.id)?'resolved':''}">${s.start_date>data.day?'Upcoming':s.end_date<data.day?'Completed':current().some(r=>r.student_id===s.id)?'Received':'Awaiting'}</span></td><td>${s.token?`<button class="row-link" data-copy="${esc(s.id)}">Copy check-in link</button>`:'Sample student'}</td></tr>`),'Add a student to begin tracking their weekly check-ins.')}</section><p class="footnote" id="page-status" role="status"></p>`;
 if(view==='settings'){
  const {reminderScheduled,reminder,sheet}=data.integrations;
  const reminderCopy=reminderScheduled
   ? 'The email automation checks daily for active, invited students. Each student who has yet to respond is eligible for one email per week.'
   : 'Active students who have yet to respond are eligible for at most one reminder per week.';
  const reminderStatus=reminderScheduled?'Daily check scheduled':reminder?'Webhook configured':'Connection required';
  const sheetAction=externalSheetLink()||`<span class="pill">${sheet?'Webhook configured':'Connection required'}</span>`;
  return title('Settings','Manage weekly delivery and spreadsheet syncing.')+`
   <section class="card formbody">
     <h2>Weekly reminders</h2>
     <p class="sub">${reminderCopy}</p>
     <p class="footnote"><span class="pill">${reminderStatus}</span></p>
     <br><h2>Spreadsheet sync</h2>
     <p class="sub">Each check-in or message appears immediately in the CRM spreadsheet.</p>
     <div class="actions" style="margin:14px 0">${sheetAction}</div>
     ${sheet||reminder?`${btn('Run connected jobs','jobs','clock',true)}<p class="footnote" id="page-status" role="status"></p>`:''}
   </section>`;
 }
 const sheet=view==='sheet';
 const support=view==='support';
 return title(sheet?'Spreadsheet':support?'Support queue':'Feedback',sheet?'Every submitted check-in and message, in one table.':support?'Review student needs and update follow-up status.':'Review weekly check-ins and messages from students.',sheet?externalSheetLink()+btn('Export CSV','export','download',true):'')+
 `<section class="card"><div class="card-head"><h2>${sheet?'Response register':support?'Open follow-ups':'All responses'}</h2></div>
 <div class="filters"><input id="search" type="search" aria-label="Search responses" placeholder="Search students or topics" value="${esc(search)}"><select id="filter" aria-label="Filter responses" style="width:auto">
 <option value="all">All ${support?'priorities':'responses'}</option><option value="urgent">Urgent</option><option value="follow">Follow-up</option>${support?'':'<option value="check-in">Check-ins</option><option value="message">Messages</option>'}</select></div><div id="filtered"></div></section>`;
}
function filterRows(){
 const result=document.querySelector('#filtered');
 if(!result)return;
 const rows=(view==='support'?queue():data.feedback).filter(r=>
  (filter==='all'||r.kind===filter||r.priority===filter)&&
  [r.name,r.destination,r.topic,r.note].join(' ').toLowerCase().includes(search.toLowerCase()));
 result.innerHTML=view==='sheet'?table(['Submitted','Week of','Student','Destination','Type','Mood','Support','Topic','Feedback','Status',''],rows.map(r=>`<tr><td>${dateLabel(r.created_at)}</td><td>${dateLabel(r.week)}</td><td>${esc(r.name)}</td><td>${esc(r.destination)}</td><td>${esc(r.kind)}</td><td>${r.mood??'—'}</td><td>${esc(r.need)}</td><td>${esc(r.topic)||'—'}</td><td style="max-width:280px;white-space:normal">${esc(r.note)||'—'}</td><td>${pill(r)}</td><td>${rowButton(r)}</td></tr>`)):feedbackTable(rows,true);
}
function render(){
 const label=views.find(([name])=>name===view)[1];
 app.innerHTML=`<div class="shell"><aside class="sidebar">${brand}<div class="nav-title">WORKSPACE</div><nav aria-label="Workspace">${views.map(([name,label])=>`<button class="nav-btn ${view===name?'active':''}" data-action="${name}" ${view===name?'aria-current="page"':''}>${icon(name,18)}${label}${name==='support'&&queue().length?`<span>${queue().length}</span>`:''}</button>`).join('')}</nav><div class="sidefoot">${avatar('Gobeyond Team')}<div><b>Gobeyond Team</b><small>Student care workspace</small></div></div></aside>
 <main><div class="top"><div>Workspace <span aria-hidden="true">/</span> <b>${label}</b></div><div>${demo?'Sample workspace':'Staff workspace'}</div></div><div class="content">
 ${demo?`<p class="notice">${loadError?esc(loadError)+' ':''}Sample data for trying the portal. <a class="row-link" href="/">Open live workspace</a></p>`:''}
 ${dataView()}</div></main></div>`;
 const query=document.querySelector('#search');
 if(query){
  query.oninput=()=>{search=query.value;filterRows();};
  const select=document.querySelector('#filter');
  select.value=filter;
  select.onchange=()=>{filter=select.value;filterRows();};
  filterRows();
 }
}
function openDialog(title,body){
 detail.innerHTML=`<div class="dialog-head"><h2>${title}</h2><button data-close title="Close" aria-label="Close">✕</button></div>${body}`;
 detail.querySelector('[data-close]').onclick=()=>detail.close();
 detail.showModal();
}
function recordDialog(record){
 openDialog(esc(record.name),`<p class="sub">${esc(record.destination)} · Week of ${dateLabel(record.week)} · ${record.kind==='message'?'Message':'Check-in'}</p>
 <p style="margin:14px 0">${pill(record)} ${record.mood?faces[record.mood]+' '+moods[record.mood]:''}</p>
 <strong>${esc(record.topic||'Student feedback')}</strong><p class="record-text">${esc(record.note)||'No written comment.'}</p>
 <p class="footnote">Support requested: ${esc(record.need==='none'?'No':record.need==='urgent'?'As soon as possible':'Yes, when available')}</p><br>
 <form><label class="field">Follow-up status<select name="status">${options(statuses)}</select></label><p class="error" role="alert"></p><button class="btn primary">Save status</button></form>`);
 const form=detail.querySelector('form');
 form.elements.status.value=record.status;
 form.onsubmit=async event=>{
  event.preventDefault();
  const status=form.elements.status.value;
  try {
   if(demo){record.status=status;saveDemo(data);}
   else{await request('/api/status',{id:record.id,status});data=await request('/api/data');}
   detail.close();render();
  }catch(error){showError(form,error);}
 };
}
function addDialog(){
 openDialog('Add a student',`<form>${textField('Full name','name','text','maxlength="100"')}${textField('Email','email','email','maxlength="254"')}${textField('Destination','destination','text','maxlength="120"')}${textField('Program start','start_date','date')}${textField('Program end','end_date','date')}<p class="error" role="alert"></p><button class="btn primary">Add student</button></form>`);
 const form=detail.querySelector('form');
 form.onsubmit=async event=>{
  event.preventDefault();
  const student=Object.fromEntries(new FormData(form));
  try{
   if(student.start_date>student.end_date)throw new Error('Choose an end date on or after the start date.');
   if(demo){
    if(data.students.some(s=>s.email.toLowerCase()===student.email.toLowerCase()))throw new Error('This student email already exists.');
    data.students.push({...student,id:crypto.randomUUID()});saveDemo(data);
   }else{await request('/api/students',student);data=await request('/api/data');}
   detail.close();render();
  }catch(error){showError(form,error);}
 };
}
function download(){
 const cols=[['Submitted','created_at'],['Week of','week'],['Student','name'],['Destination','destination'],['Type','kind'],['Mood','mood'],['Support','need'],['Topic','topic'],['Feedback','note'],['Priority','priority'],['Status','status']];
 const cell=value=>{
  let raw=String(value??'');
  if(/^[\s]*[=+@-]|^[\t\r\n]/.test(raw))raw="'"+raw;
  return '"'+raw.replaceAll('"','""')+'"';
 };
 const csv=[cols.map(c=>cell(c[0])).join(','),...data.feedback.map(r=>cols.map(c=>cell(r[c[1]])).join(','))].join('\r\n');
 const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='gobeyond-feedback-'+data.day+'.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
app.addEventListener('click',async event=>{
 const button=event.target.closest('button');
 if(!button||!data)return;
 const action=button.dataset.action;
 if(views.some(([key])=>key===action)){view=action;search='';filter='all';render();return;}
 if(action==='add')addDialog();
 if(action==='export')download();
 if(action==='jobs'){
  const status=document.querySelector('#page-status');
  button.disabled=true;
  try{
   if(demo)throw new Error('Open the live workspace to run connected jobs.');
   const jobs=await request('/api/jobs',{});
   status.textContent=jobs.sheetConfigured||jobs.reminderConfigured?`${jobs.sent} delivered · ${jobs.failed} failed.`:'Connect a reminder or spreadsheet webhook to run delivery.';
  }catch(error){status.textContent=error.message;}finally{button.disabled=false;}
 }
 if(button.dataset.record){
  const record=data.feedback.find(r=>r.id===button.dataset.record);
  if(record)recordDialog(record);
 }
 if(button.dataset.copy){
  const student=data.students.find(s=>s.id===button.dataset.copy);
  if(!student)return;
  try{await navigator.clipboard.writeText(studentLink(student));document.querySelector('#page-status').textContent='Personal check-in link copied.';}
  catch{openDialog('Personal check-in link',`<label class="field">Copy this link<input readonly value="${esc(studentLink(student))}"></label>`);}
 }
});
async function formPage(){
 const query=new URLSearchParams(location.search);
 const preview=query.has('demo');
 const token=location.hash.slice(1);
 let student,kind=query.get('type')==='message'?'message':'check-in';
 const shell=(title,sub,body)=>`<main class="formpage">${brand}<section class="hero"><div><div class="eyebrow">${icon('globe',16)} Student support</div><h2>${title}</h2><p>${sub}</p></div></section><section class="card formbody">${body}</section></main>`;
 try{
  student=preview?{name:'',week:currentWeek,submitted:false}:await request('/api/student?token='+encodeURIComponent(token));
 }catch(error){app.innerHTML=shell('Weekly check-in','Stay in touch with your Gobeyond team.',`<p class="error">${esc(error.message)}</p>`);return;}
 if(student.submitted)kind='message';
 let submissionId=crypto.randomUUID();
 function form(){
  const message=kind==='message';
  app.innerHTML=shell(message?'Message your team':'Your weekly check-in',`${student.name?'Hi '+esc(student.name.split(' ')[0])+'. ':''}${message?'Send a question or ask for help.':'How has your week abroad been?'}`,`
   ${preview?'<p class="notice">Sample form. Your response will appear in the sample workspace on this browser.</p>':''}
   ${student.submitted?'<p class="notice">Your check-in for this week is saved. You can still send a message.</p>':''}
   <div class="actions" style="margin-bottom:17px">${student.submitted?'':'<button class="btn" id="switch-kind">'+(message?'Back to weekly check-in':'Send a separate message')+'</button>'}</div>
   <form>
   ${message?'':`<fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">How are you feeling this week?</legend><div class="choices">${faces.slice(1).map((face,i)=>`<label><input type="radio" name="mood" value="${i+1}" required><span><b aria-hidden="true">${face}</b>${moods[i+1]}</span></label>`).join('')}</div></fieldset>`}
   <label class="field">Would you like support?<select name="need" required><option value="none">No, thank you</option><option value="soon">Yes, when available</option><option value="urgent">Yes, as soon as possible</option></select></label>
   <label class="field">What is this about? (optional)<select name="topic"><option value="">Choose a topic</option>${options(topics)}</select></label>
   <label class="field">${message?'What would you like to tell us?':'Anything else you want to share? (optional)'}<textarea name="note" maxlength="2000" ${message?'required':''} placeholder="A question, something that went well, or something you’d like help with"></textarea></label>
   <p class="muted">Your Gobeyond support team can read your response.</p><p class="error" role="alert"></p>
   <button type="submit" class="btn primary">${message?'Send message':'Submit check-in'}</button></form>`);
  const toggle=document.querySelector('#switch-kind');
  if(toggle)toggle.onclick=()=>{kind=message?'check-in':'message';form();};
  const element=app.querySelector('form');
  element.onsubmit=async event=>{
   event.preventDefault();
   const button=element.querySelector('button[type=submit]');
   button.disabled=true;
   const input={...Object.fromEntries(new FormData(element)),kind,token,id:submissionId};
   try{
    if(message&&!input.note.trim())throw new Error('Enter a message before sending.');
    if(preview){
     const mock=readDemo(), priority=input.need==='urgent'?'urgent':input.need==='soon'||message||Number(input.mood)<=2?'follow':'routine';
     mock.feedback.unshift({...input,id:submissionId,week:currentWeek,student_id:'preview',name:'Sample submission',destination:'Demo',mood:message?null:Number(input.mood),priority,status:priority==='routine'?'resolved':'open',created_at:new Date().toISOString()});
     saveDemo(mock);
    }else await request('/api/submit',input);
    student.submitted ||= !message;
    app.innerHTML=shell('Thanks for sharing','Your response has been saved.',`<p class="muted">Your Gobeyond team has received your ${message?'message':'check-in'}.</p><button id="another" class="btn primary">Send another message</button> ${preview?'<a href="/?demo=1" class="btn">Open sample workspace</a>':''}`);
    document.querySelector('#another').onclick=()=>{submissionId=crypto.randomUUID();kind='message';form();};
   }catch(error){showError(element,error);button.disabled=false;}
  };
 }
 form();
}
async function boot(){
 if(location.pathname==='/check-in'){await formPage();return;}
 if(new URLSearchParams(location.search).has('demo')){demo=true;data=readDemo();render();return;}
 app.innerHTML='<main class="formpage"><p>Loading student care workspace…</p></main>';
 try{data=await request('/api/data');}
 catch(error){demo=true;loadError=error.message;data=readDemo();}
 render();
 if(!demo&&data.students.length===0){
  document.querySelector('.intro .actions').insertAdjacentHTML('afterbegin','<a class="btn" href="/?demo=1">View sample workspace</a>');
 }
}
window.addEventListener('storage',event=>{if(demo&&event.key===demoKey){data=readDemo();render();}});
boot();
