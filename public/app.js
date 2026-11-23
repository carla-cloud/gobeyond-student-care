const app=document.querySelector('#app');
const detail=document.querySelector('#detail');
const langKey='gobeyond-lang';
let lang=(()=>{try{return localStorage.getItem(langKey)==='it'?'it':'en';}catch{return 'en';}})();
// Italian translations, keyed by the English text shown on screen.
const IT={
 'Gobeyond Student Care':'Gobeyond Assistenza Studenti',
 'Language':'Lingua',
 // Navigation and layout
 'WORKSPACE':'AREA DI LAVORO',
 'Workspace':'Area di lavoro',
 'Overview':'Panoramica',
 'Feedback':'Feedback',
 'Students':'Studenti',
 'Support queue':'Richieste di supporto',
 'Spreadsheet':'Foglio di calcolo',
 'Settings':'Impostazioni',
 'Gobeyond Team':'Team Gobeyond',
 'Student care workspace':'Area assistenza studenti',
 'Sample workspace':'Area di esempio',
 'Staff workspace':'Area staff',
 'Sample data for trying the portal.':'Dati di esempio per provare il portale.',
 'Open live workspace':'Apri l’area di lavoro reale',
 'View sample workspace':'Vedi l’area di esempio',
 'Open sample workspace':'Apri l’area di esempio',
 'Loading student care workspace…':'Caricamento dell’area assistenza studenti…',
 'Staff sign-in':'Accesso staff',
 // Moods, topics, statuses and stored values
 'Struggling':'In difficoltà',
 'Low':'Giù',
 'Okay':'Così così',
 'Good':'Bene',
 'Great':'Benissimo',
 'School':'Scuola',
 'Host family or accommodation':'Famiglia ospitante o alloggio',
 'Friends and settling in':'Amici e ambientamento',
 'Wellbeing':'Benessere',
 'Travel or logistics':'Viaggi o logistica',
 'Other':'Altro',
 'Open':'Aperto',
 'In progress':'In corso',
 'Resolved':'Risolto',
 'Urgent':'Urgente',
 'Follow-up':'Da seguire',
 'Routine':'Ordinario',
 'open':'aperto',
 'in progress':'in corso',
 'resolved':'risolto',
 'urgent':'urgente',
 'follow':'da seguire',
 'routine':'ordinario',
 'check-in':'check-in',
 'message':'messaggio',
 // Overview
 'Student care overview':'Panoramica assistenza studenti',
 'Track weekly feedback and follow up with students abroad.':'Monitora i feedback settimanali e segui gli studenti all’estero.',
 'Export CSV':'Esporta CSV',
 'Preview check-in':'Anteprima check-in',
 'Weekly check-ins':'Check-in settimanali',
 'How are your students doing?':'Come stanno i tuoi studenti?',
 '{answered} of {count} active students have checked in this week.':'Check-in ricevuti questa settimana: {answered} su {count}.',
 'Add a student to start collecting weekly feedback.':'Aggiungi uno studente per iniziare a raccogliere i feedback settimanali.',
 'Weekly metrics':'Metriche settimanali',
 'Active students':'Studenti attivi',
 'Currently abroad':'Attualmente all’estero',
 'Check-ins received':'Check-in ricevuti',
 '{rate}% response rate':'Tasso di risposta: {rate}%',
 'This week':'Questa settimana',
 'Awaiting response':'In attesa di risposta',
 'Due this week':'Previsti questa settimana',
 'Open follow-ups':'Follow-up aperti',
 '{count} urgent':'Urgenti: {count}',
 'Recent feedback':'Feedback recenti',
 'Latest check-ins and messages':'Ultimi check-in e messaggi',
 'View all':'Vedi tutti',
 'Students who may need help':'Studenti che potrebbero aver bisogno di aiuto',
 'Requested support':'Ha richiesto supporto',
 'Contact this week':'Da contattare questa settimana',
 'Difficult: {areas}':'Difficoltà: {areas}',
 'No open follow-ups.':'Nessun follow-up aperto.',
 // Tables
 'Student':'Studente',
 'Week of':'Settimana del',
 'Type':'Tipo',
 'Mood':'Umore',
 'Topic':'Argomento',
 'Status':'Stato',
 'Message':'Messaggio',
 'Check-in':'Check-in',
 'View':'Apri',
 'No records to show.':'Nessun dato da mostrare.',
 'Feedback appears here as students submit check-ins and messages.':'I feedback compariranno qui quando gli studenti invieranno check-in e messaggi.',
 'Submitted':'Inviato il',
 'Destination':'Destinazione',
 'Support':'Supporto',
 'Priority':'Priorità',
 // Students
 'Manage program dates and personal check-in links.':'Gestisci le date dei programmi e i link personali per il check-in.',
 'Add student':'Aggiungi studente',
 'Student directory':'Elenco studenti',
 'Email':'Email',
 'Program dates':'Date del programma',
 'Upcoming':'In arrivo',
 'Completed':'Concluso',
 'Received':'Ricevuto',
 'Awaiting':'In attesa',
 'Copy check-in link':'Copia link check-in',
 'Sample student':'Studente di esempio',
 'Add a student to begin tracking their weekly check-ins.':'Aggiungi uno studente per iniziare a seguire i suoi check-in settimanali.',
 // Settings
 'Manage weekly delivery and spreadsheet syncing.':'Gestisci l’invio settimanale e la sincronizzazione del foglio di calcolo.',
 'Weekly reminders':'Promemoria settimanali',
 'The email automation checks daily for active students. Each student who has yet to check in gets one email per week, and a reminder four days later if they still haven’t replied. Their personal link opens without an account.':'L’automazione email controlla ogni giorno gli studenti attivi. Ogni studente che non ha ancora fatto il check-in riceve un’email a settimana e, se dopo quattro giorni non ha ancora risposto, un promemoria. Il suo link personale si apre senza account.',
 'Active students who have yet to check in get one email per week, and a reminder four days later if they still haven’t replied.':'Gli studenti attivi che non hanno ancora fatto il check-in ricevono un’email a settimana e, se dopo quattro giorni non hanno ancora risposto, un promemoria.',
 'Daily check scheduled':'Controllo giornaliero programmato',
 'Webhook configured':'Webhook configurato',
 'Connection required':'Connessione richiesta',
 'Spreadsheet sync':'Sincronizzazione del foglio di calcolo',
 'Each check-in or message appears immediately in the CRM spreadsheet.':'Ogni check-in o messaggio compare subito nel foglio di calcolo del CRM.',
 'Run connected jobs':'Esegui le attività collegate',
 'Open Google Sheet':'Apri Google Sheet',
 // Feedback, spreadsheet and support views
 'Every submitted check-in and message, in one table.':'Tutti i check-in e i messaggi inviati, in un’unica tabella.',
 'Review student needs and update follow-up status.':'Esamina le esigenze degli studenti e aggiorna lo stato dei follow-up.',
 'Review weekly check-ins and messages from students.':'Consulta i check-in settimanali e i messaggi degli studenti.',
 'Response register':'Registro delle risposte',
 'All responses':'Tutte le risposte',
 'Search responses':'Cerca nelle risposte',
 'Search students or topics':'Cerca studenti o argomenti',
 'Filter responses':'Filtra le risposte',
 'All priorities':'Tutte le priorità',
 'Check-ins':'Check-in',
 'Messages':'Messaggi',
 // Dialogs
 'Close':'Chiudi',
 'Week of {date}':'Settimana del {date}',
 'Student feedback':'Feedback dello studente',
 'No written comment.':'Nessun commento scritto.',
 'Support requested:':'Supporto richiesto:',
 'No':'No',
 'Yes, not urgent':'Sì, non urgente',
 'Yes, this week':'Sì, questa settimana',
 'Yes, urgent':'Sì, urgente',
 'Follow-up status':'Stato del follow-up',
 'Save status':'Salva stato',
 'Add a student':'Aggiungi uno studente',
 'Full name':'Nome e cognome',
 'Program start':'Inizio del programma',
 'Program end':'Fine del programma',
 'Choose an end date on or after the start date.':'Scegli una data di fine uguale o successiva alla data di inizio.',
 'This student email already exists.':'Esiste già uno studente con questa email.',
 'Open the live workspace to run connected jobs.':'Apri l’area di lavoro reale per eseguire le attività collegate.',
 '{sent} delivered · {failed} failed.':'Consegnati: {sent} · Non riusciti: {failed}.',
 'Connect a reminder or spreadsheet webhook to run delivery.':'Collega un webhook per i promemoria o per il foglio di calcolo per avviare l’invio.',
 'Personal check-in link copied.':'Link personale per il check-in copiato.',
 'Personal check-in link':'Link personale per il check-in',
 'Copy this link':'Copia questo link',
 // Student check-in page
 'Student support':'Supporto studenti',
 'Weekly check-in':'Check-in settimanale',
 'Stay in touch with your Gobeyond team.':'Resta in contatto con il tuo team Gobeyond.',
 'Message your team':'Scrivi al tuo team',
 'Your weekly check-in':'Il tuo check-in settimanale',
 'Hi {name}. ':'Ciao {name}. ',
 'Send a question or ask for help.':'Invia una domanda o chiedi aiuto.',
 'How has your week abroad been?':'Com’è andata la tua settimana all’estero?',
 'Sample form. Your response will appear in the sample workspace on this browser.':'Modulo di esempio. La tua risposta comparirà nell’area di esempio su questo browser.',
 'Your check-in for this week is saved. You can still send a message.':'Il tuo check-in di questa settimana è stato salvato. Puoi comunque inviare un messaggio.',
 'Back to weekly check-in':'Torna al check-in settimanale',
 'Send a separate message':'Invia un messaggio separato',
 'How are you feeling this week?':'Come ti senti questa settimana?',
 'How are these things going?':'Come stanno andando queste cose?',
 'Studies':'Studio',
 'Housing / host family':'Alloggio / famiglia ospitante',
 'Social life & friends':'Vita sociale e amici',
 'Health & wellbeing':'Salute e benessere',
 'Money':'Soldi',
 'Difficult':'Difficile',
 'Do you need support from us with anything?':'Hai bisogno del nostro supporto per qualcosa?',
 'No, all good':'No, tutto bene',
 'Yes, but it’s not urgent':'Sì, ma non è urgente',
 'Yes, please contact me this week':'Sì, contattatemi questa settimana',
 'Yes, it’s urgent':'Sì, è urgente',
 'What is this about? (optional)':'Di cosa si tratta? (facoltativo)',
 'Choose a topic':'Scegli un argomento',
 'What would you like to tell us?':'Cosa vorresti dirci?',
 'Anything else you’d like to tell us or ask? (optional)':'C’è altro che vuoi dirci o chiederci? (facoltativo)',
 'A question, something that went well, or something you’d like help with':'Una domanda, qualcosa che è andato bene o qualcosa per cui ti serve aiuto',
 'Your Gobeyond support team can read your response.':'Il tuo team di supporto Gobeyond può leggere la tua risposta.',
 'Send message':'Invia messaggio',
 'Submit check-in':'Invia check-in',
 'Enter a message before sending.':'Scrivi un messaggio prima di inviarlo.',
 'Thanks for sharing':'Grazie per aver condiviso',
 'Your response has been saved.':'La tua risposta è stata salvata.',
 'Your Gobeyond team has received your message.':'Il tuo team Gobeyond ha ricevuto il tuo messaggio.',
 'Your Gobeyond team has received your check-in.':'Il tuo team Gobeyond ha ricevuto il tuo check-in.',
 'Send another message':'Invia un altro messaggio',
 // Messages returned by the server
 'Unable to reach the CRM.':'Impossibile raggiungere il CRM.',
 'Something went wrong.':'Si è verificato un errore.',
 'Invalid request origin.':'Origine della richiesta non valida.',
 'Demo data is handled in the browser.':'I dati di esempio sono gestiti nel browser.',
 'The CRM database is unavailable.':'Il database del CRM non è disponibile.',
 'Method unavailable.':'Metodo non disponibile.',
 'Ask your Gobeyond coordinator for your personal check-in link.':'Chiedi al tuo coordinatore Gobeyond il tuo link personale per il check-in.',
 'This check-in link is outside your program dates.':'Questo link per il check-in è fuori dalle date del tuo programma.',
 'Please complete the required fields.':'Compila i campi obbligatori.',
 'Your check-in for this week is already saved.':'Il tuo check-in di questa settimana è già stato salvato.',
 'Reload the form and try again.':'Ricarica il modulo e riprova.',
 'A check-in for this week already exists. Reload to send a separate message.':'Esiste già un check-in per questa settimana. Ricarica la pagina per inviare un messaggio separato.',
 'Staff access is required.':'È richiesto l’accesso staff.',
 'Sign in to open the staff workspace.':'Accedi per aprire l’area staff.',
 'Check the student details and program dates.':'Controlla i dati dello studente e le date del programma.',
 'Choose a valid status.':'Scegli uno stato valido.',
 'The feedback record was not found.':'Il feedback non è stato trovato.',
 'This page does not exist.':'Questa pagina non esiste.',
 'The request could not be read.':'Non è stato possibile leggere la richiesta.',
 'The CRM could not complete the request. Try again.':'Il CRM non è riuscito a completare la richiesta. Riprova.'
};
// Translate English text into the current language, filling {placeholders} from vars.
function t(text,vars={}){
 if(typeof text!=='string')return text;
 let out=lang==='it'&&Object.hasOwn(IT,text)?IT[text]:text;
 for(const [key,value] of Object.entries(vars))out=out.replaceAll('{'+key+'}',()=>String(value));
 return out;
}
let rerender=()=>{};
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
// The language tab: one click switches English <-> Italian.
const langToggle=(cls='')=>`<button type="button" class="lang-tab ${cls}" data-lang-toggle aria-label="${lang==='en'?'Language: English. Switch to Italian':'Lingua: italiano. Passa all’inglese'}" title="${lang==='en'?'Switch to Italian':'Passa all’inglese'}">${icon('globe',18)}<span class="lang-label">${t('Language')}</span><span class="lang-switch" aria-hidden="true"><b class="${lang==='en'?'on':''}">EN</b><b class="${lang==='it'?'on':''}">IT</b></span></button>`;
const formTop=()=>`<div class="formtop">${brand}${langToggle('light')}</div>`;
const moods=['','Struggling','Low','Okay','Good','Great'];
const faces=['','😟','🙁','😐','🙂','😄'];
const topics=['School','Host family or accommodation','Friends and settling in','Wellbeing','Travel or logistics','Other'];
const statuses=['open','in progress','resolved'];
// Weekly check-in: "How are these things going?" areas and their answers.
const areas=[['studies','Studies'],['housing','Housing / host family'],['social','Social life & friends'],['health','Health & wellbeing'],['money','Money']];
const ratings=[['good','Good'],['ok','OK'],['difficult','Difficult']];
// "Do you need support from us?" answers (stored value, question wording).
const needs=[['none','No, all good'],['soon','Yes, but it’s not urgent'],['week','Yes, please contact me this week'],['urgent','Yes, it’s urgent']];
const needLabel=need=>t({none:'No',soon:'Yes, not urgent',week:'Yes, this week',urgent:'Yes, urgent'}[need]??need);
const ratingLabel=value=>t(ratings.find(([key])=>key===value)?.[1]??value);
const ratingClass=value=>value==='good'?'resolved':value==='difficult'?'follow':'';
const areaSummary=r=>{
 const hard=areas.filter(([key])=>r[key]==='difficult').map(([,label])=>t(label));
 return hard.length?t('Difficult: {areas}',{areas:hard.join(', ')}):'';
};
// Same rules as the server: urgent request -> urgent; any request, message, low mood or a "Difficult" area -> follow-up.
const priorityFor=r=>r.need==='urgent'?'urgent':r.need!=='none'||r.kind==='message'||Number(r.mood)<=2||areas.some(([key])=>r[key]==='difficult')?'follow':'routine';
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const capital=value=>value.charAt(0).toUpperCase()+value.slice(1);
const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dateLabel=(value,options={day:'numeric',month:'short'})=>new Intl.DateTimeFormat(lang==='it'?'it-IT':'en-GB',{...options,timeZone:'Europe/Madrid'}).format(new Date(value.length===10?value+'T12:00:00Z':value));
const d=new Date(day+'T12:00:00Z');
d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
const currentWeek=d.toISOString().slice(0,10);
const weekEnd=new Date(d.getTime()+6*86400000).toISOString().slice(0,10);
const dateAfter=offset=>new Date(Date.parse(day+'T12:00:00Z')+offset*86400000).toISOString().slice(0,10);
// Sample check-ins: name, destination, mood, support, area answers (studies,housing,social,health,money), comment.
const examples=[
 ['Sofia Rossi','Toronto, Canada',2,'soon','ok,difficult,ok,good,good','I’m finding it hard to settle into the host family’s routine. Could we talk?'],
 ['Luca Bianchi','Dublin, Ireland',4,'none','good,good,good,good,ok','My classes are going well and I joined the football team.'],
 ['Giulia Romano','Brighton, UK',1,'urgent','ok,ok,difficult,difficult,ok','I’m having a tough week and would like to speak to my coordinator.'],
 ['Emma Conti','Vancouver, Canada',5,'none','good,good,good,good,good','I made new friends on a school trip.'],
 ['Matteo Ricci','Auckland, New Zealand',3,'week','difficult,good,ok,good,ok','Can you help me understand how to change one of my classes?'],
 ['Alice Marino','Boston, USA',4,'none','good,good,good,ok,ok','I’m feeling a lot more at home this week.'],
 ['Leonardo Costa','Oxford, UK'],['Beatrice Gallo','Ottawa, Canada']
];
const exampleData=()=>({
 students:examples.map(([name,destination],i)=>({id:'sample-'+i,name,destination,email:'student'+i+'@example.com',start_date:dateAfter(-60),end_date:dateAfter(90)})),
 feedback:examples.slice(0,6).map(([name,destination,mood,need,answers,note],i)=>{
  const record={id:'demo-'+i,student_id:'sample-'+i,name,destination,kind:'check-in',week:currentWeek,mood,need,topic:'',note,
   created_at:new Date(Date.now()-i*7200000).toISOString()};
  answers.split(',').forEach((value,j)=>{record[areas[j][0]]=value;});
  record.priority=priorityFor(record);
  record.status=i===4?'in progress':record.priority==='routine'?'resolved':'open';
  return record;
 }),day,week:currentWeek,integrations:{sheet:false,reminder:false}
});
const demoKey='gobeyond-demo-v2';
function readDemo(){
 try {const data=JSON.parse(localStorage.getItem(demoKey));if(data?.week===currentWeek) return data;}catch{}
 return exampleData();
}
function saveDemo(data){localStorage.setItem(demoKey,JSON.stringify(data));}
async function request(path,body){
 const response=await fetch(path,body===undefined?{}:{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 const value=await response.json().catch(()=>({error:'Unable to reach the CRM.'}));
 if(!response.ok) throw Object.assign(new Error(value.error||'Something went wrong.'),{status:response.status});
 return value;
}
function showError(form,error){form.querySelector('.error').textContent=t(error.message);}
function textField(label,name,type='text',extra=''){return `<label class="field">${t(label)}<input name="${name}" type="${type}" required ${extra}></label>`;}
function options(values){return values.map(value=>`<option value="${esc(value)}">${esc(t(capital(value)))}</option>`).join('');}
function avatar(name){return `<span class="avatar">${esc(name.split(' ').map(word=>word[0]).slice(0,2).join('').toUpperCase())}</span>`;}
function pill(r){
 const label=r.status==='resolved'?'Resolved':r.priority==='urgent'?'Urgent':r.status==='in progress'?'In progress':r.priority==='follow'?'Follow-up':'Routine';
 return `<span class="pill ${r.status==='resolved'?'resolved':r.priority}">${t(label)}</span>`;
}
function studentLink(s){return location.origin+'/check-in#'+s.token;}
const views=[['overview','Overview'],['feedback','Feedback'],['students','Students'],['support','Support queue'],['sheet','Spreadsheet'],['settings','Settings']];

let data,view='overview',demo=false,search='',filter='all';
const active=()=>data.students.filter(s=>s.start_date<=data.day&&s.end_date>=data.day);
const current=()=>data.feedback.filter(r=>r.week===data.week&&r.kind==='check-in');
const queue=()=>data.feedback.filter(r=>r.priority!=='routine'&&r.status!=='resolved').sort((a,b)=>Number(b.priority==='urgent')-Number(a.priority==='urgent')||Number(b.need==='week')-Number(a.need==='week')||b.created_at.localeCompare(a.created_at));
// Short reason a response is in the support queue, e.g. "Contact this week · Difficult: Money".
const queueReason=r=>[r.need==='week'?t('Contact this week'):'',areaSummary(r),r.topic?t(r.topic):''].filter(Boolean).join(' · ')||r.note||t('Requested support');
const waiting=()=>active().filter(s=>!current().some(r=>r.student_id===s.id));
const person=r=>`<div class="person">${avatar(r.name)}<div><b>${esc(r.name)}</b><small>${esc(r.destination)}</small></div></div>`;
const rowButton=r=>`<button class="row-link" data-record="${esc(r.id)}">${t('View')}</button>`;
const metric=(label,value,desc,i,color='')=>`<div class="metric"><div class="metric-top"><span class="tile ${color}">${icon(i)}</span>${t(label)}</div><strong>${value}</strong><small>${desc}</small></div>`;
const title=(name,sub,buttons='')=>`<section class="intro"><div><h1>${t(name)}</h1><p>${t(sub)}</p></div><div class="actions">${buttons}</div></section>`;
const btn=(label,action,i,primary=false)=>`<button class="btn ${primary?'primary':''}" data-action="${action}">${i?icon(i,16):''}${t(label)}</button>`;
const externalSheetLink=()=>data.integrations.sheetUrl
 ? `<a class="btn" href="${esc(data.integrations.sheetUrl)}" target="_blank" rel="noopener noreferrer">${icon('sheet',16)} ${t('Open Google Sheet')}</a>`
 : '';
const table=(head,rows,empty='No records to show.')=>rows.length?`<div class="table-wrap"><table><thead><tr>${head.map(h=>'<th>'+t(h)+'</th>').join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`:`<p class="empty">${t(empty)}</p>`;
const moodLabel=r=>r.mood?faces[r.mood]+' '+t(moods[r.mood]):'—';
const feedbackTable=(rows,full=false)=>table(full?['Student','Week of','Type','Mood','Topic','Status','']:['Student','Mood','Status',''],
 rows.map(r=>`<tr><td>${person(r)}</td>${full?`<td>${dateLabel(r.week)}</td><td>${t(r.kind==='message'?'Message':'Check-in')}</td>`:''}<td>${moodLabel(r)}</td>${full?`<td>${esc(r.topic?t(r.topic):areaSummary(r))||'—'}</td>`:''}<td>${pill(r)}</td><td>${rowButton(r)}</td></tr>`),'Feedback appears here as students submit check-ins and messages.');

function overview(){
 const count=active().length;
 const answered=count-waiting().length;
 const open=queue();
 const sampleLink=!demo&&data.students.length===0?`<a class="btn" href="/?demo=1">${t('View sample workspace')}</a>`:'';
 return title('Student care overview','Track weekly feedback and follow up with students abroad.',
   sampleLink+btn('Export CSV','export','download')+`<a class="btn primary" href="/check-in?demo=1" target="_blank" rel="noopener">${icon('link',16)} ${t('Preview check-in')}</a>`)+
 `<section class="hero"><div><div class="eyebrow">${icon('globe',16)} ${t('Weekly check-ins')}</div><h2>${t('How are your students doing?')}</h2><p>${count ? t('{answered} of {count} active students have checked in this week.',{answered,count}) : t('Add a student to start collecting weekly feedback.')}</p></div><div class="week">${icon('calendar',16)}${dateLabel(data.week)} – ${dateLabel(weekEnd)}</div></section>
 <section class="metrics" aria-label="${t('Weekly metrics')}">
 ${metric('Active students',count,t('Currently abroad'),'students')}
 ${metric('Check-ins received',answered,count?t('{rate}% response rate',{rate:Math.round(answered/count*100)}):t('This week'),'feedback','green')}
 ${metric('Awaiting response',waiting().length,t('Due this week'),'clock','purple')}
 ${metric('Open follow-ups',open.length,t('{count} urgent',{count:open.filter(r=>r.priority==='urgent').length}),'support','orange')}
 </section>
 <section class="grid">
 <div class="card"><div class="card-head"><div><h2>${t('Recent feedback')}</h2><p>${t('Latest check-ins and messages')}</p></div>${btn('View all','feedback')}</div>${feedbackTable(data.feedback.slice(0,5))}</div>
 <div class="card"><div class="card-head"><div><h2>${t('Support queue')}</h2><p>${t('Students who may need help')}</p></div></div><div class="queue">${open.length?open.slice(0,5).map(r=>`<button class="queue-item" data-record="${esc(r.id)}">${avatar(r.name)}<span class="copy"><b>${esc(r.name)}</b><small>${esc(queueReason(r))}</small></span>${pill(r)}</button>`).join(''):`<p class="empty">${t('No open follow-ups.')}</p>`}</div></div>
 </section>`;
}
function dataView(){
 if(view==='overview') return overview();
 if(view==='students') return title('Students','Manage program dates and personal check-in links.',btn('Add student','add','plus',true))+
  `<section class="card"><div class="card-head"><h2>${t('Student directory')}</h2></div>${table(['Student','Email','Program dates','This week',''],data.students.map(s=>{
   const received=current().some(r=>r.student_id===s.id);
   const state=s.start_date>data.day?'Upcoming':s.end_date<data.day?'Completed':received?'Received':'Awaiting';
   return `<tr><td>${person(s)}</td><td>${esc(s.email)}</td><td>${dateLabel(s.start_date)} – ${dateLabel(s.end_date)}</td><td><span class="pill ${received?'resolved':''}">${t(state)}</span></td><td>${s.token?`<button class="row-link" data-copy="${esc(s.id)}">${t('Copy check-in link')}</button>`:t('Sample student')}</td></tr>`;
  }),'Add a student to begin tracking their weekly check-ins.')}</section><p class="footnote" id="page-status" role="status"></p>`;
 if(view==='settings'){
  const {reminderScheduled,reminder,sheet}=data.integrations;
  const reminderCopy=reminderScheduled
   ? 'The email automation checks daily for active students. Each student who has yet to check in gets one email per week, and a reminder four days later if they still haven’t replied. Their personal link opens without an account.'
   : 'Active students who have yet to check in get one email per week, and a reminder four days later if they still haven’t replied.';
  const reminderStatus=reminderScheduled?'Daily check scheduled':reminder?'Webhook configured':'Connection required';
  const sheetAction=externalSheetLink()||`<span class="pill">${t(sheet?'Webhook configured':'Connection required')}</span>`;
  return title('Settings','Manage weekly delivery and spreadsheet syncing.')+`
   <section class="card formbody">
     <h2>${t('Weekly reminders')}</h2>
     <p class="sub">${t(reminderCopy)}</p>
     <p class="footnote"><span class="pill">${t(reminderStatus)}</span></p>
     <br><h2>${t('Spreadsheet sync')}</h2>
     <p class="sub">${t('Each check-in or message appears immediately in the CRM spreadsheet.')}</p>
     <div class="actions" style="margin:14px 0">${sheetAction}</div>
     ${sheet||reminder?`${btn('Run connected jobs','jobs','clock',true)}<p class="footnote" id="page-status" role="status"></p>`:''}
   </section>`;
 }
 const sheet=view==='sheet';
 const support=view==='support';
 return title(sheet?'Spreadsheet':support?'Support queue':'Feedback',sheet?'Every submitted check-in and message, in one table.':support?'Review student needs and update follow-up status.':'Review weekly check-ins and messages from students.',sheet?externalSheetLink()+btn('Export CSV','export','download',true):'')+
 `<section class="card"><div class="card-head"><h2>${t(sheet?'Response register':support?'Open follow-ups':'All responses')}</h2></div>
 <div class="filters"><input id="search" type="search" aria-label="${t('Search responses')}" placeholder="${t('Search students or topics')}" value="${esc(search)}"><select id="filter" aria-label="${t('Filter responses')}" style="width:auto">
 <option value="all">${t(support?'All priorities':'All responses')}</option><option value="urgent">${t('Urgent')}</option><option value="follow">${t('Follow-up')}</option>${support?'':`<option value="check-in">${t('Check-ins')}</option><option value="message">${t('Messages')}</option>`}</select></div><div id="filtered"></div></section>`;
}
function filterRows(){
 const result=document.querySelector('#filtered');
 if(!result)return;
 const rows=(view==='support'?queue():data.feedback).filter(r=>
  (filter==='all'||r.kind===filter||r.priority===filter)&&
  [r.name,r.destination,r.topic,t(r.topic),areaSummary(r),r.note].join(' ').toLowerCase().includes(search.toLowerCase()));
 result.innerHTML=view==='sheet'?table(['Submitted','Week of','Student','Destination','Type','Mood',...areas.map(([,label])=>label),'Support','Topic','Feedback','Status',''],rows.map(r=>`<tr><td>${dateLabel(r.created_at)}</td><td>${dateLabel(r.week)}</td><td>${esc(r.name)}</td><td>${esc(r.destination)}</td><td>${esc(t(r.kind))}</td><td>${r.mood??'—'}</td>${areas.map(([key])=>`<td>${r[key]?`<span class="pill ${ratingClass(r[key])}">${esc(ratingLabel(r[key]))}</span>`:'—'}</td>`).join('')}<td>${esc(needLabel(r.need))}</td><td>${esc(t(r.topic))||'—'}</td><td style="max-width:280px;white-space:normal">${esc(r.note)||'—'}</td><td>${pill(r)}</td><td>${rowButton(r)}</td></tr>`)):feedbackTable(rows,true);
}
function render(){
 rerender=render;
 const label=views.find(([name])=>name===view)[1];
 app.innerHTML=`<div class="shell"><aside class="sidebar">${brand}<div class="nav-title">${t('WORKSPACE')}</div><nav aria-label="${t('Workspace')}">${views.map(([name,label])=>`<button class="nav-btn ${view===name?'active':''}" data-action="${name}" ${view===name?'aria-current="page"':''}>${icon(name,18)}${t(label)}${name==='support'&&queue().length?`<span>${queue().length}</span>`:''}</button>`).join('')}</nav><div class="lang-wrap">${langToggle()}</div><div class="sidefoot">${avatar('Gobeyond Team')}<div><b>${t('Gobeyond Team')}</b><small>${t('Student care workspace')}</small></div></div></aside>
 <main><div class="top"><div>${t('Workspace')} <span aria-hidden="true">/</span> <b>${t(label)}</b></div><div>${t(demo?'Sample workspace':'Staff workspace')}</div></div><div class="content">
 ${demo?`<p class="notice">${t('Sample data for trying the portal.')} <a class="row-link" href="/">${t('Open live workspace')}</a></p>`:''}
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
 detail.innerHTML=`<div class="dialog-head"><h2>${title}</h2><button data-close title="${t('Close')}" aria-label="${t('Close')}">✕</button></div>${body}`;
 detail.querySelector('[data-close]').onclick=()=>detail.close();
 detail.showModal();
}
function recordDialog(record){
 const areaRows=areas.filter(([key])=>record[key]).map(([key,label])=>`<li><span>${t(label)}</span><span class="pill ${ratingClass(record[key])}">${esc(ratingLabel(record[key]))}</span></li>`).join('');
 openDialog(esc(record.name),`<p class="sub">${esc(record.destination)} · ${t('Week of {date}',{date:dateLabel(record.week)})} · ${t(record.kind==='message'?'Message':'Check-in')}</p>
 <p style="margin:14px 0">${pill(record)} ${record.mood?faces[record.mood]+' '+t(moods[record.mood]):''}</p>
 ${areaRows?`<ul class="area-list" aria-label="${t('How are these things going?')}">${areaRows}</ul>`:''}
 <strong>${esc(record.topic?t(record.topic):t('Student feedback'))}</strong><p class="record-text">${esc(record.note)||t('No written comment.')}</p>
 <p class="footnote">${t('Support requested:')} ${esc(needLabel(record.need))}</p><br>
 <form><label class="field">${t('Follow-up status')}<select name="status">${options(statuses)}</select></label><p class="error" role="alert"></p><button class="btn primary">${t('Save status')}</button></form>`);
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
 openDialog(t('Add a student'),`<form>${textField('Full name','name','text','maxlength="100"')}${textField('Email','email','email','maxlength="254"')}${textField('Destination','destination','text','maxlength="120"')}${textField('Program start','start_date','date')}${textField('Program end','end_date','date')}<p class="error" role="alert"></p><button class="btn primary">${t('Add student')}</button></form>`);
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
 const cols=[['Submitted','created_at'],['Week of','week'],['Student','name'],['Destination','destination'],['Type','kind'],['Mood','mood'],...areas.map(([key,label])=>[label,key]),['Support','need'],['Topic','topic'],['Feedback','note'],['Priority','priority'],['Status','status']];
 const translated=new Set(['kind','topic','priority','status']);
 const areaKeys=new Set(areas.map(([key])=>key));
 const value=(r,key)=>key==='need'?needLabel(r.need):areaKeys.has(key)?(r[key]?ratingLabel(r[key]):''):translated.has(key)?t(r[key]):r[key];
 const cell=value=>{
  let raw=String(value??'');
  if(/^[\s]*[=+@-]|^[\t\r\n]/.test(raw))raw="'"+raw;
  return '"'+raw.replaceAll('"','""')+'"';
 };
 const csv=[cols.map(c=>cell(t(c[0]))).join(','),...data.feedback.map(r=>cols.map(c=>cell(value(r,c[1]))).join(','))].join('\r\n');
 const url=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'}));
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
   status.textContent=jobs.sheetConfigured||jobs.reminderConfigured?t('{sent} delivered · {failed} failed.',{sent:jobs.sent,failed:jobs.failed}):t('Connect a reminder or spreadsheet webhook to run delivery.');
  }catch(error){status.textContent=t(error.message);}finally{button.disabled=false;}
 }
 if(button.dataset.record){
  const record=data.feedback.find(r=>r.id===button.dataset.record);
  if(record)recordDialog(record);
 }
 if(button.dataset.copy){
  const student=data.students.find(s=>s.id===button.dataset.copy);
  if(!student)return;
  try{await navigator.clipboard.writeText(studentLink(student));document.querySelector('#page-status').textContent=t('Personal check-in link copied.');}
  catch{openDialog(t('Personal check-in link'),`<label class="field">${t('Copy this link')}<input readonly value="${esc(studentLink(student))}"></label>`);}
 }
});
async function formPage(){
 const query=new URLSearchParams(location.search);
 const preview=query.has('demo');
 const token=location.hash.slice(1);
 let student,kind=query.get('type')==='message'?'message':'check-in';
 const shell=(title,sub,body)=>`<main class="formpage">${formTop()}<section class="hero"><div><div class="eyebrow">${icon('globe',16)} ${t('Student support')}</div><h2>${title}</h2><p>${sub}</p></div></section><section class="card formbody">${body}</section></main>`;
 try{
  student=preview?{name:'',week:currentWeek,submitted:false}:await request('/api/student',{token});
 }catch(error){
  const linkProblem=()=>{app.innerHTML=shell(t('Weekly check-in'),t('Stay in touch with your Gobeyond team.'),`<p class="error">${esc(t(error.message))}</p>`);};
  rerender=linkProblem;linkProblem();return;
 }
 if(student.submitted)kind='message';
 let submissionId=crypto.randomUUID();
 function thanks(message){
  rerender=()=>thanks(message);
  app.innerHTML=shell(t('Thanks for sharing'),t('Your response has been saved.'),`<p class="muted">${t(message?'Your Gobeyond team has received your message.':'Your Gobeyond team has received your check-in.')}</p><button id="another" class="btn primary">${t('Send another message')}</button> ${preview?`<a href="/?demo=1" class="btn">${t('Open sample workspace')}</a>`:''}`);
  document.querySelector('#another').onclick=()=>{submissionId=crypto.randomUUID();kind='message';form();};
 }
 function form(values={}){
  const message=kind==='message';
  app.innerHTML=shell(t(message?'Message your team':'Your weekly check-in'),`${student.name?t('Hi {name}. ',{name:esc(student.name.split(' ')[0])}):''}${t(message?'Send a question or ask for help.':'How has your week abroad been?')}`,`
   ${preview?`<p class="notice">${t('Sample form. Your response will appear in the sample workspace on this browser.')}</p>`:''}
   ${student.submitted?`<p class="notice">${t('Your check-in for this week is saved. You can still send a message.')}</p>`:''}
   <div class="actions" style="margin-bottom:17px">${student.submitted?'':`<button class="btn" id="switch-kind">${t(message?'Back to weekly check-in':'Send a separate message')}</button>`}</div>
   <form>
   ${message?'':`<fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('How are you feeling this week?')}</legend><div class="choices">${faces.slice(1).map((face,i)=>`<label><input type="radio" name="mood" value="${i+1}" required><span><b aria-hidden="true">${face}</b>${t(moods[i+1])}</span></label>`).join('')}</div></fieldset>
   <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:4px">${t('How are these things going?')}</legend><div class="areas">${areas.map(([key,label])=>`<div class="area-row" role="radiogroup" aria-label="${t(label)}"><span class="area-name">${t(label)}</span><div class="scale">${ratings.map(([value,text])=>`<label><input type="radio" name="${key}" value="${value}" required><span class="${value}">${t(text)}</span></label>`).join('')}</div></div>`).join('')}</div></fieldset>`}
   <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('Do you need support from us with anything?')}</legend><div class="support-options">${needs.map(([value,label])=>`<label><input type="radio" name="need" value="${value}" required><span>${t(label)}</span></label>`).join('')}</div></fieldset>
   ${message?`<label class="field">${t('What is this about? (optional)')}<select name="topic"><option value="">${t('Choose a topic')}</option>${options(topics)}</select></label>`:''}
   <label class="field">${t(message?'What would you like to tell us?':'Anything else you’d like to tell us or ask? (optional)')}<textarea name="note" maxlength="2000" ${message?'required':''} placeholder="${t('A question, something that went well, or something you’d like help with')}"></textarea></label>
   <p class="muted">${t('Your Gobeyond support team can read your response.')}</p><p class="error" role="alert"></p>
   <button type="submit" class="btn primary">${t(message?'Send message':'Submit check-in')}</button></form>`);
  const element=app.querySelector('form');
  // Keep anything the student already filled in when the language changes.
  for(const [name,value] of Object.entries(values))if(element.elements[name])element.elements[name].value=value;
  rerender=()=>form(Object.fromEntries(new FormData(element)));
  const toggle=document.querySelector('#switch-kind');
  if(toggle)toggle.onclick=()=>{kind=message?'check-in':'message';form();};
  element.onsubmit=async event=>{
   event.preventDefault();
   const button=element.querySelector('button[type=submit]');
   button.disabled=true;
   const input={...Object.fromEntries(new FormData(element)),kind,token,id:submissionId};
   try{
    if(message&&!input.note.trim())throw new Error('Enter a message before sending.');
    if(preview){
     const mock=readDemo();
     const record={...input,topic:input.topic??'',id:submissionId,week:currentWeek,student_id:'preview',name:'Sample submission',destination:'Demo',mood:message?null:Number(input.mood),created_at:new Date().toISOString()};
     record.priority=priorityFor(record);
     record.status=record.priority==='routine'?'resolved':'open';
     mock.feedback.unshift(record);
     saveDemo(mock);
    }else await request('/api/submit',input);
    student.submitted ||= !message;
    thanks(message);
   }catch(error){showError(element,error);button.disabled=false;}
  };
 }
 form();
}
function setLang(next){
 lang=next;
 document.documentElement.lang=next;
 document.title=t('Gobeyond Student Care');
 rerender();
}
document.addEventListener('click',event=>{
 if(!event.target.closest('[data-lang-toggle]'))return;
 const next=lang==='en'?'it':'en';
 try{localStorage.setItem(langKey,next);}catch{}
 setLang(next);
 document.querySelector('[data-lang-toggle]')?.focus();
});
async function boot(){
 document.documentElement.lang=lang;
 document.title=t('Gobeyond Student Care');
 if(location.pathname==='/check-in'){await formPage();return;}
 if(new URLSearchParams(location.search).has('demo')){demo=true;data=readDemo();render();return;}
 rerender=()=>{app.innerHTML=`<main class="formpage"><p>${t('Loading student care workspace…')}</p></main>`;};
 rerender();
 try{data=await request('/api/data');}
 catch(error){
  const signIn=()=>{
   const signInLink=error.status===401?`<a class="btn primary" href="/signin-with-chatgpt?return_to=%2F" target="_top">${t('Staff sign-in')}</a>`:'';
   app.innerHTML=`<main class="formpage">${formTop()}<section class="card formbody"><h1>${t('Staff workspace')}</h1><p class="sub" style="margin-bottom:16px">${esc(t(error.message))}</p>${signInLink}</section></main>`;
  };
  rerender=signIn;signIn();
  return;
 }
 render();
}
window.addEventListener('storage',event=>{
 if(demo&&event.key===demoKey){data=readDemo();render();}
 if(event.key===langKey){const next=event.newValue==='it'?'it':'en';if(next!==lang)setLang(next);}
});
boot();
