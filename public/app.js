const app=document.querySelector('#app');
const detail=document.querySelector('#detail');
const langKey='gobeyond-lang';
// A saved choice wins; otherwise student pages follow the browser language (Italian students see Italian), staff pages start in English.
let lang=(()=>{try{const saved=localStorage.getItem(langKey);if(saved)return saved==='it'?'it':'en';}catch{}return /^\/(check-in|final)$/.test(location.pathname)&&/^it\b/i.test(navigator.language||'')?'it':'en';})();
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
 'Sign in with ChatGPT':'Accedi con ChatGPT',
 'You can also open the personal staff sign-in link sent to your email.':'Puoi anche aprire il link di accesso personale inviato alla tua email.',
 'Gobeyond staff access':'Accesso staff Gobeyond',
 'Open the staff workspace with your personal staff link.':'Apri l’area staff con il tuo link personale.',
 'Open staff workspace':'Apri l’area staff',
 'Sign out':'Esci',
 // Editing, deleting and restoring records
 'Edit':'Modifica',
 'Edit {name}':'Modifica {name}',
 'Delete':'Elimina',
 'Restore':'Ripristina',
 'Delete {name}':'Elimina {name}',
 'Restore {name}':'Ripristina {name}',
 'response from {name}':'risposta di {name}',
 'Recently deleted':'Eliminati di recente',
 'No deleted students.':'Nessuno studente eliminato.',
 'No deleted responses.':'Nessuna risposta eliminata.',
 'Edit response':'Modifica risposta',
 'Delete response':'Elimina risposta',
 'Delete student':'Elimina studente',
 'Delete student?':'Eliminare lo studente?',
 'Delete response?':'Eliminare la risposta?',
 'Deleting {name} pauses their check-ins and hides their feedback. Restore the profile from Recently deleted in Students.':'Eliminando {name} i suoi check-in vengono sospesi e i suoi feedback nascosti. Puoi ripristinare il profilo da Eliminati di recente in Studenti.',
 'Delete the response from {name}? You can restore it from Recently deleted in Feedback.':'Eliminare la risposta di {name}? Puoi ripristinarla da Eliminati di recente in Feedback.',
 'Student deleted. Restore it from Recently deleted in Students.':'Studente eliminato. Puoi ripristinarlo da Eliminati di recente in Studenti.',
 'Response deleted. Restore it from Recently deleted in Feedback.':'Risposta eliminata. Puoi ripristinarla da Eliminati di recente in Feedback.',
 'Student restored.':'Studente ripristinato.',
 'Response restored.':'Risposta ripristinata.',
 'Choose a mood':'Scegli un umore',
 'Support requested':'Supporto richiesto',
 'Topic (optional)':'Argomento (facoltativo)',
 'Written feedback (optional)':'Feedback scritto (facoltativo)',
 'Save response':'Salva risposta',
 'Enter a message before saving.':'Scrivi un messaggio prima di salvare.',
 'Edit student':'Modifica studente',
 'Save changes':'Salva modifiche',
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
 // Consultant call booking (student) and Calendar (staff)
 'Calendar':'Calendario',
 'Consultant calls booked by students who asked for urgent support.':'Chiamate con i consulenti prenotate dagli studenti che hanno chiesto supporto urgente.',
 'Times are in Italian time.':'Gli orari sono in ora italiana.',
 'Time':'Orario',
 'Consultant':'Consulente',
 'Check-in note':'Nota del check-in',
 'slot|Open':'Libero',
 'Booked':'Prenotato',
 'Cancelled':'Annullato',
 'Cancel':'Annulla',
 'Day':'Giorno',
 'Previous month':'Mese precedente',
 'Next month':'Mese successivo',
 'Available: {count}':'Disponibili: {count}',
 'No times':'Nessun orario',
 'Choose a day with available times. Days with times are marked with a dot.':'Scegli un giorno con orari disponibili. I giorni con orari sono indicati da un punto.',
 'Choose a consultant to see their times.':'Scegli un consulente per vedere i suoi orari.',
 'No times for {name} on this day.':'Nessun orario per {name} in questo giorno.',
 'Selected: {day} at {time} with {name}':'Selezionato: {day} alle {time} con {name}',
 'Available times':'Orari disponibili',
 'Booked calls':'Chiamate prenotate',
 'Consultants for this day':'Consulenti per questo giorno',
 'Cancel appointment?':'Annullare l’appuntamento?',
 '{student} with {consultant}, {day} at {time} (Italian time).':'{student} con {consultant}, {day} alle {time} (ora italiana).',
 'The student is not notified automatically, and this time will not be offered again.':'Lo studente non viene avvisato automaticamente e questo orario non verrà più proposto.',
 'Cancel appointment':'Annulla appuntamento',
 'Keep appointment':'Mantieni appuntamento',
 'Book a call with a consultant (optional)':'Prenota una chiamata con un consulente (facoltativo)',
 'Choose a time if you’d like to talk to one of our consultants. Times are in Italian time.':'Scegli un orario se vuoi parlare con uno dei nostri consulenti. Gli orari sono in ora italiana.',
 'Loading available times…':'Caricamento degli orari disponibili…',
 'Available times could not be loaded. Your team will contact you.':'Non è stato possibile caricare gli orari disponibili. Il tuo team ti contatterà.',
 'No times are available right now. Your team will contact you.':'Al momento non ci sono orari disponibili. Il tuo team ti contatterà.',
 '{time} your time':'{time} ora locale',
 'No call for now':'Per ora nessuna chiamata',
 'Call booked with {name}':'Chiamata prenotata con {name}',
 '{day} at {time} (Italian time)':'{day} alle {time} (ora italiana)',
 'Consultant’s phone: {phone}':'Telefono del consulente: {phone}',
 'That time was just booked by someone else. Your check-in is saved. Choose another time or skip.':'Quell’orario è appena stato prenotato da qualcun altro. Il tuo check-in è stato salvato. Scegli un altro orario o salta.',
 'Book call':'Prenota la chiamata',
 'Skip':'Salta',
 'Choose a time first.':'Scegli prima un orario.',
 'Calls can only be booked from an urgent check-in this week.':'Le chiamate si possono prenotare solo da un check-in urgente di questa settimana.',
 'The appointment was not found or is already cancelled.':'L’appuntamento non è stato trovato o è già stato annullato.',
 // Consultant availability (staff)
 'Add availability':'Aggiungi disponibilità',
 'Add consultant availability':'Aggiungi disponibilità del consulente',
 'Date':'Data',
 'From':'Dalle',
 'To':'Alle',
 'Call length':'Durata della chiamata',
 '{n} minutes':'{n} minuti',
 'Times to add: {times}':'Orari da aggiungere: {times}',
 'Add times':'Aggiungi orari',
 'Times added: {count}.':'Orari aggiunti: {count}.',
 'Remove':'Rimuovi',
 'Remove this time?':'Rimuovere questo orario?',
 '{consultant}, {day} at {time} (Italian time).':'{consultant}, {day} alle {time} (ora italiana).',
 'Students will no longer be able to book it.':'Gli studenti non potranno più prenotarlo.',
 'Remove time':'Rimuovi orario',
 'Keep time':'Mantieni orario',
 'Choose a consultant, a date and a time range.':'Scegli un consulente, una data e una fascia oraria.',
 'The end time must be after the start time.':'L’orario di fine deve essere successivo a quello di inizio.',
 'The time range is shorter than one call.':'La fascia oraria è più breve di una chiamata.',
 'Add at most 24 times at once.':'Aggiungi al massimo 24 orari alla volta.',
 'Choose times in the future.':'Scegli orari futuri.',
 'Some of these times overlap with this consultant’s existing availability.':'Alcuni di questi orari si sovrappongono alla disponibilità già inserita per questo consulente.',
 'This time was not found or is no longer open.':'Questo orario non è stato trovato o non è più libero.',
 // Final feedback (student form)
 'End of your journey':'Fine del tuo viaggio',
 'Your Go Beyond experience':'La tua esperienza Go Beyond',
 'Tell us how your program went.':'Raccontaci com’è andato il tuo programma.',
 'Your program has ended: tell us how it went. It takes less than 4 minutes.':'Il tuo programma è terminato: raccontaci com’è andata. Ci vogliono meno di 4 minuti.',
 'Sample form. Your answers will appear in the sample workspace on this browser.':'Modulo di esempio. Le tue risposte compariranno nell’area di esempio su questo browser.',
 'Step {n} of 3':'Passo {n} di 3',
 'Overall':'Nel complesso',
 'Your stay':'Il tuo soggiorno',
 'Your words':'Le tue parole',
 'Overall, how was your experience abroad?':'Nel complesso, com’è stata la tua esperienza all’estero?',
 'How likely are you to recommend Go Beyond to a friend?':'Quanto è probabile che consiglieresti Go Beyond a un amico?',
 'Not at all likely':'Per niente probabile',
 'Extremely likely':'Estremamente probabile',
 'Where did you live?':'Dove hai vissuto?',
 'Host family':'Famiglia ospitante',
 'Boarding house':'Boarding house',
 'Rate each part of your stay from 1 (very poor) to 5 (excellent).':'Valuta ogni aspetto del soggiorno da 1 (pessimo) a 5 (ottimo).',
 'Life with your host family':'Vita in famiglia',
 'Life in the boarding house':'Vita in boarding house',
 'Life with your host family / in the boarding house':'Vita in famiglia / in boarding house',
 'School life and the quality of teaching':'Vita a scuola e qualità della didattica',
 'Making friends with international and local students':'Amicizie con studenti internazionali e ragazzi del posto',
 'Support on site from your Local Coordinator and/or Tutor':'Assistenza in loco del Local Coordinator e/o del Tutor',
 'Support from the Go Beyond team in Italy, before and during your stay':'Supporto del team Go Beyond in Italia, prima e durante il soggiorno',
 'Travel and arrival organisation':'Organizzazione del viaggio e dell’arrivo',
 'Very poor':'Pessimo',
 'Poor':'Scarso',
 'Fair':'Sufficiente',
 'scale|Good':'Buono',
 'Excellent':'Ottimo',
 '(optional)':'(facoltativo)',
 'Tell us what went wrong':'Raccontaci cosa è andato storto',
 'Comment (optional)':'Commento (facoltativo)',
 'Add a comment':'Aggiungi un commento',
 'What was the best part of your experience?':'Qual è stata la parte migliore della tua esperienza?',
 'What was the hardest part, or what should we improve?':'Qual è stata la parte più difficile, o cosa dovremmo migliorare?',
 'One piece of advice for a student leaving for the same destination':'Un consiglio per chi partirà per la stessa destinazione',
 'Can we share your comments with your first name and destination on our website and social media?':'Possiamo condividere i tuoi commenti, con nome e destinazione, sul nostro sito e sui social?',
 'Would you like to hear about future Go Beyond programs?':'Vuoi ricevere informazioni sui prossimi programmi Go Beyond?',
 'Yes':'Sì',
 'Back':'Indietro',
 'Next':'Avanti',
 'Send my feedback':'Invia il mio feedback',
 'Thank you!':'Grazie!',
 'You have already sent your final feedback.':'Hai già inviato il tuo feedback finale.',
 'Your final feedback has been saved.':'Il tuo feedback finale è stato salvato.',
 'Thank you for helping us make Go Beyond better for the students who come after you.':'Grazie per aiutarci a rendere Go Beyond migliore per gli studenti che partiranno dopo di te.',
 'Tell us what went wrong for each topic you rated 1 or 2.':'Raccontaci cosa è andato storto per ogni aspetto valutato 1 o 2.',
 'Only the Go Beyond team can read your answers. We use them to support you and to improve our programs.':'Solo il team Go Beyond può leggere le tue risposte. Le usiamo per supportarti e per migliorare i nostri programmi.',
 // Final feedback (staff)
 'Final feedback':'Feedback finale',
 'final':'feedback finale',
 'Low scores in the final feedback':'Punteggi bassi nel feedback finale',
 'What students tell us when their program ends.':'Cosa ci raccontano gli studenti alla fine del programma.',
 'Preview final form':'Anteprima modulo finale',
 'All destinations':'Tutte le destinazioni',
 'All end months':'Tutti i mesi di fine',
 'Testimonials only':'Solo testimonianze',
 'Final feedback summary':'Riepilogo del feedback finale',
 'Invited':'Invitati',
 'Students sent the form':'Studenti a cui è stato inviato il modulo',
 'Responses received':'Risposte ricevute',
 'No invitations yet':'Ancora nessun invito',
 'Overall rating':'Valutazione complessiva',
 'Average out of 5':'Media su 5',
 'Recommendation score':'Indice di raccomandazione',
 'NPS: % 9–10 minus % 0–6':'NPS: % 9–10 meno % 0–6',
 'Testimonials':'Testimonianze',
 'Responses':'Risposte',
 'Only students who agreed to share their words.':'Solo gli studenti che hanno accettato di condividere le loro parole.',
 'Newest first':'Dalle più recenti',
 'Average by topic':'Media per argomento',
 'Out of 5. Below 3 is highlighted.':'Su 5. Sotto 3 è evidenziato.',
 'Low scores':'Punteggi bassi',
 'Promoter':'Promotore',
 'Passive':'Passivo',
 'Detractor':'Detrattore',
 'Advice':'Consiglio',
 'No testimonials with consent yet.':'Ancora nessuna testimonianza con consenso.',
 'Final feedback appears here when students finish their program and answer the form.':'Il feedback finale compare qui quando gli studenti concludono il programma e rispondono al modulo.',
 'Host family / boarding house':'Famiglia ospitante / boarding house',
 'School and teaching':'Scuola e didattica',
 'Friends':'Amicizie',
 'Local Coordinator / Tutor':'Local Coordinator / Tutor',
 'Go Beyond team':'Team Go Beyond',
 'Travel and arrival':'Viaggio e arrivo',
 'Sent on {date}':'Inviato il {date}',
 'Sent on':'Inviato il',
 'Where they lived':'Dove ha vissuto',
 'Best part':'Parte migliore',
 'Hardest part / to improve':'Parte più difficile / da migliorare',
 'Advice for future students':'Consiglio per i futuri studenti',
 'Share comments publicly':'Condividere i commenti pubblicamente',
 'Future programs':'Programmi futuri',
 'Open the follow-up':'Apri il follow-up',
 'Open the final feedback':'Apri il feedback finale',
 'Recommend (0–10)':'Consiglierebbe (0–10)',
 'comment':'commento',
 'Final feedback form':'Modulo di feedback finale',
 'Received on {date}':'Ricevuto il {date}',
 'Sent, waiting for an answer':'Inviato, in attesa di risposta',
 'Not sent yet':'Non ancora inviato',
 'The form opens 3 days before the end of the program and closes 30 days after it. The invitation is sent automatically on the end date, with reminders after 4 and 10 days.':'Il modulo si apre 3 giorni prima della fine del programma e si chiude 30 giorni dopo. L’invito parte automaticamente il giorno di fine, con promemoria dopo 4 e 10 giorni.',
 'Final feedback link':'Link del feedback finale',
 'Send the form by email now':'Invia ora il modulo via email',
 'Copy link':'Copia link',
 'Link copied.':'Link copiato.',
 'Sent.':'Inviato.',
 'The final feedback form is sent automatically on each student’s end date, with reminders after 4 and 10 days. It stays open for 30 days.':'Il modulo di feedback finale parte automaticamente il giorno di fine di ogni studente, con promemoria dopo 4 e 10 giorni. Resta aperto per 30 giorni.',
 // Student record, student page, trends, activity, privacy
 'View {name}':'Apri {name}',
 'Phone or WhatsApp (optional)':'Telefono o WhatsApp (facoltativo)',
 'Phone or WhatsApp':'Telefono o WhatsApp',
 'Email language':'Lingua delle email',
 'Automatic (Italian until the student chooses)':'Automatica (italiano finché lo studente non sceglie)',
 'Automatic':'Automatica',
 'Parent email for emergencies (optional)':'Email di un genitore per le emergenze (facoltativa)',
 'Parent email (emergencies)':'Email del genitore (emergenze)',
 'Never used for check-ins or the final feedback form.':'Non viene mai usata per i check-in o per il feedback finale.',
 'Mood week by week':'Umore settimana per settimana',
 'How things went, week by week':'Com’è andata, settimana per settimana',
 'No weekly check-ins yet.':'Ancora nessun check-in settimanale.',
 'No responses yet.':'Ancora nessuna risposta.',
 'Calls':'Chiamate',
 'No calls booked.':'Nessuna chiamata prenotata.',
 'Recommend':'Consiglierebbe',
 'View answers':'Vedi le risposte',
 'Not received yet.':'Non ancora ricevuto.',
 'Average mood':'Umore medio',
 '“Difficult” answers':'Risposte “Difficile”',
 'Trends over the last 8 weeks':'Andamento delle ultime 8 settimane',
 'Average mood and “Difficult” answers per area, from weekly check-ins.':'Umore medio e risposte “Difficile” per area, dai check-in settimanali.',
 'Where students struggle':'Dove gli studenti hanno difficoltà',
 'Recent activity':'Attività recenti',
 'Who did what in the workspace.':'Chi ha fatto cosa nell’area di lavoro.',
 'When':'Quando',
 'Who':'Chi',
 'What':'Cosa',
 'Details':'Dettagli',
 'No activity yet.':'Ancora nessuna attività.',
 'student added':'studente aggiunto',
 'student edited':'studente modificato',
 'student deleted':'studente eliminato',
 'student restored':'studente ripristinato',
 'response deleted':'risposta eliminata',
 'response restored':'risposta ripristinata',
 'response edited':'risposta modificata',
 'status changed':'stato modificato',
 'call cancelled':'chiamata annullata',
 'consultant saved':'consulente salvato',
 'availability added':'disponibilità aggiunta',
 'recurring availability added':'disponibilità ricorrente aggiunta',
 'time removed':'orario rimosso',
 'example times removed':'orari di esempio rimossi',
 'final feedback form sent':'modulo di feedback finale inviato',
 'Privacy':'Privacy',
 'Personal details and written answers are removed {n} months after a program ends. Ratings are kept for statistics.':'Dati personali e risposte scritte vengono rimossi {n} mesi dopo la fine del programma. Le valutazioni restano per le statistiche.',
 'No automatic removal is set. Set RETENTION_MONTHS on the hosting platform to remove personal details and written answers that many months after a program ends.':'Nessuna rimozione automatica impostata. Imposta RETENTION_MONTHS sulla piattaforma di hosting per rimuovere dati personali e risposte scritte quel numero di mesi dopo la fine del programma.',
 'Copied':'Copiato',
 'Copy':'Copia',
 'Copy this text':'Copia questo testo',
 // Booking: phone, booking later, calendar extras, consultants, recurring availability
 'Your phone or WhatsApp number':'Il tuo numero di telefono o WhatsApp',
 'The consultant will call you on this number.':'Il consulente ti chiamerà a questo numero.',
 'Enter a phone number so the consultant can call you.':'Inserisci un numero di telefono così il consulente può chiamarti.',
 'You told us this week that it’s urgent. You can still book a call with a consultant.':'Questa settimana ci hai detto che è urgente. Puoi ancora prenotare una chiamata con un consulente.',
 'This time is no longer available. Choose another time.':'Questo orario non è più disponibile. Scegli un altro orario.',
 'by {who}':'da {who}',
 'Inactive':'Non attivo',
 'Active':'Attivo',
 'Consultants':'Consulenti',
 'Name':'Nome',
 'Phone':'Telefono',
 'Email (gets a copy of booking emails)':'Email (riceve una copia delle email di prenotazione)',
 'Active: students can book this consultant':'Attivo: gli studenti possono prenotare questo consulente',
 'Add a consultant':'Aggiungi un consulente',
 'Add consultant':'Aggiungi consulente',
 'Add a new consultant instead':'Aggiungi invece un nuovo consulente',
 'Recurring availability':'Disponibilità ricorrente',
 'All active consultants':'Tutti i consulenti attivi',
 'Days':'Giorni',
 'Time blocks (Italian time)':'Fasce orarie (ora italiana)',
 'Morning from':'Mattina dalle',
 'Afternoon from':'Pomeriggio dalle',
 'to':'alle',
 'Leave a block empty to skip it.':'Lascia vuota una fascia per saltarla.',
 'Starting':'A partire da',
 'Number of weeks':'Numero di settimane',
 'About {n} times in total ({per} per consultant per day). Times in the past or already taken are skipped.':'Circa {n} orari in totale ({per} per consulente al giorno). Gli orari passati o già occupati vengono saltati.',
 'Add these times':'Aggiungi questi orari',
 'Times added: {count}. Skipped: {skipped}.':'Orari aggiunti: {count}. Saltati: {skipped}.',
 'Remove example times':'Rimuovi orari di esempio',
 'Remove example times?':'Rimuovere gli orari di esempio?',
 '{n} open example times were created when the app first started.':'Orari di esempio liberi creati al primo avvio dell’app: {n}.',
 'Booked and cancelled calls stay. Times you added yourself are not touched.':'Le chiamate prenotate e annullate restano. Gli orari aggiunti da voi non vengono toccati.',
 'Keep them':'Mantienili',
 // Messages returned by the server (new)
 'Ask your Gobeyond coordinator for your personal feedback link.':'Chiedi al tuo coordinatore Gobeyond il tuo link personale per il feedback.',
 'The final feedback form is open from 3 days before to 30 days after the end of your program.':'Il modulo di feedback finale è aperto da 3 giorni prima a 30 giorni dopo la fine del tuo programma.',
 'You have already sent your final feedback. Thank you!':'Hai già inviato il tuo feedback finale. Grazie!',
 'The final feedback form opens 3 days before the end of the program.':'Il modulo di feedback finale si apre 3 giorni prima della fine del programma.',
 'The final feedback form closed 30 days after the end of the program.':'Il modulo di feedback finale si è chiuso 30 giorni dopo la fine del programma.',
 'This student has already sent their final feedback.':'Questo studente ha già inviato il feedback finale.',
 'Connect a reminder webhook to send emails.':'Collega un webhook dei promemoria per inviare email.',
 'The email could not be sent. Try again.':'Non è stato possibile inviare l’email. Riprova.',
 'Check the phone number.':'Controlla il numero di telefono.',
 'Check the parent email address.':'Controlla l’email del genitore.',
 'Check the consultant’s name, phone and email.':'Controlla nome, telefono ed email del consulente.',
 'The consultant was not found.':'Consulente non trovato.',
 'Choose consultants, days, time blocks, a start date and a number of weeks.':'Scegli consulenti, giorni, fasce orarie, una data di inizio e il numero di settimane.',
 'That would add more than 1,500 times. Choose fewer weeks or time blocks.':'Verrebbero aggiunti più di 1.500 orari. Scegli meno settimane o fasce orarie.',
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
 'The CRM could not complete the request. Try again.':'Il CRM non è riuscito a completare la richiesta. Riprova.',
 'This staff sign-in link is invalid or expired.':'Questo link di accesso staff non è valido o è scaduto.',
 'Could not start a staff session. Try again.':'Impossibile avviare la sessione staff. Riprova.',
 'This staff sign-in link has already been used.':'Questo link di accesso staff è già stato usato.',
 'The student record was not found.':'Lo studente non è stato trovato.',
 'This student is in Recently deleted. Restore them to use this email.':'Questo studente è in Eliminati di recente. Ripristinalo per usare questa email.',
 'Choose a record.':'Scegli un elemento.',
 'This student already has a check-in for that week.':'Questo studente ha già un check-in per quella settimana.',
 'The record was not found.':'Elemento non trovato.'
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
 plus:'M12 5v14 M5 12h14',
 final:'M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z',
 user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
 repeat:'M17 2l4 4-4 4 M3 11V9a3 3 0 0 1 3-3h15 M7 22l-4-4 4-4 M21 13v2a3 3 0 0 1-3 3H3'
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
// Consultant calls: times are stored in UTC and shown in Italian time (plus the viewer's own time when it differs).
const callZone='Europe/Rome';
const localZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
const locale=()=>lang==='it'?'it-IT':'en-GB';
const callDay=(iso,zone=callZone)=>new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
const callTime=(iso,zone=callZone)=>new Intl.DateTimeFormat(locale(),{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(iso));
// Italian weekdays are lower case mid-sentence ("martedì"), so headings pass atStart=true.
const callDayLabel=(iso,atStart=true)=>{
 const label=new Intl.DateTimeFormat(locale(),{timeZone:callZone,weekday:'long',day:'numeric',month:'long'}).format(new Date(iso));
 return atStart?capital(label):label;
};
const localCallTime=iso=>{
 const sameDay=callDay(iso,localZone)===callDay(iso);
 if(sameDay&&callTime(iso,localZone)===callTime(iso))return '';
 const weekday=sameDay?'':new Intl.DateTimeFormat(locale(),{timeZone:localZone,weekday:'short'}).format(new Date(iso))+' ';
 return t('{time} your time',{time:weekday+callTime(iso,localZone)});
};
// Translation that can differ by context, e.g. a slot that is "Open" is "Libero" in Italian.
const tIn=(context,text)=>lang==='it'&&Object.hasOwn(IT,context+'|'+text)?IT[context+'|'+text]:t(text);
const slotClass=status=>status==='open'?'resolved':status==='cancelled'?'cancelled':'booked';
const slotLabel=status=>tIn('slot',capital(status));
const phoneLink=phone=>`<a href="tel:${esc(String(phone).replace(/\s+/g,''))}">${esc(phone)}</a>`;
// Sample-workspace consultants and slots (the live app gets the same ones from the server).
const consultantList=[['maria','Maria','+39 320 123 4567'],['francesco','Francesco','+39 331 234 5678'],['giorgia','Giorgia','+39 342 345 6789']];
const exampleTimes={maria:['09:30','14:00'],francesco:['11:00','16:00'],giorgia:['10:00','15:30']};
function italianTime(date,time){
 const [y,m,dd]=date.split('-').map(Number),[h,mi]=time.split(':').map(Number);
 const wanted=Date.UTC(y,m-1,dd,h,mi);
 let utc=wanted;
 for(let i=0;i<2;i++){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:callZone,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).formatToParts(new Date(utc)).map(part=>[part.type,part.value]));
  utc+=wanted-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);
 }
 return new Date(utc).toISOString();
}
function exampleSlots(){
 const days=[];
 for(let offset=1;days.length<3;offset++){const date=dateAfter(offset);const weekday=new Date(date+'T12:00:00Z').getUTCDay();if(weekday!==0&&weekday!==6)days.push(date);}
 return days.flatMap(date=>consultantList.flatMap(([key,name,phone])=>exampleTimes[key].map(time=>{
  const starts_at=italianTime(date,time);
  return {id:key+'-'+date+'-'+time.replace(':',''),consultant_id:key,starts_at,ends_at:new Date(Date.parse(starts_at)+30*60000).toISOString(),status:'open',consultant_name:name,consultant_phone:phone,student_name:null,feedback_id:null,note:null};
 })));
}
// Booking calendar, shared by the student form and the staff Calendar page:
// pick a day on a month grid, then a consultant, then see that consultant's times (all in Italian time).
const consultantOf=s=>s.consultant_id||consultantList.find(([,name])=>name===s.consultant_name)?.[0];
const dayOf=date=>date+'T12:00:00Z';
function dayCounts(slots){
 const counts={};
 for(const s of slots){const key=callDay(s.starts_at);(counts[key]??={open:0,booked:0,cancelled:0})[s.status]++;}
 return counts;
}
function monthGrid({month,selected,counts,disabled=()=>false}){
 const [y,m]=month.split('-').map(Number);
 const first=new Date(Date.UTC(y,m-1,1));
 const blanks=(first.getUTCDay()+6)%7;
 const length=new Date(Date.UTC(y,m,0)).getUTCDate();
 const today=callDay(new Date().toISOString());
 const shift=delta=>new Date(Date.UTC(y,m-1+delta,1)).toISOString().slice(0,7);
 const weekdays=[0,1,2,3,4,5,6].map(i=>new Intl.DateTimeFormat(locale(),{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2024,0,1+i))));
 const heading=capital(new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric',timeZone:'UTC'}).format(first));
 const cells=[];
 for(let dd=1;dd<=length;dd++){
  const date=month+'-'+String(dd).padStart(2,'0');
  const {open=0,booked=0}=counts[date]||{};
  const off=disabled(date);
  cells.push(`<button type="button" class="cal-day${date===selected?' selected':''}${date===today?' today':''}" data-cal-day="${date}" aria-pressed="${date===selected}" aria-label="${callDayLabel(dayOf(date))}: ${t('Available: {count}',{count:open})}" ${off?'disabled':''}>${dd}<span class="cal-dots" aria-hidden="true">${open?'<i class="dot open"></i>':''}${booked?'<i class="dot booked"></i>':''}</span></button>`);
 }
 return `<div class="cal"><div class="cal-head"><button type="button" class="cal-nav" data-cal-month="${shift(-1)}" aria-label="${t('Previous month')}">‹</button><b>${heading}</b><button type="button" class="cal-nav" data-cal-month="${shift(1)}" aria-label="${t('Next month')}">›</button></div>
 <div class="cal-grid">${weekdays.map(w=>`<span class="cal-weekday" aria-hidden="true">${w}</span>`).join('')}${'<span></span>'.repeat(blanks)}${cells.join('')}</div></div>`;
}
// After a re-render, put keyboard focus back on the equivalent calendar control.
function refocus(clicked,root){
 const nav=clicked.classList.contains('cal-nav')?[...root.querySelectorAll('.cal-nav')].indexOf(clicked):-1;
 const [key]=Object.keys(clicked.dataset);
 return ()=>{
  const scope=root.isConnected?root:document;
  const target=nav>=0?scope.querySelectorAll('.cal-nav')[nav]:key&&scope.querySelector(`[data-${key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}="${CSS.escape(clicked.dataset[key])}"]`);
  target?.focus();
 };
}
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
const exampleData=()=>{
 const feedback=examples.slice(0,6).map(([name,destination,mood,need,answers,note],i)=>{
  const record={id:'demo-'+i,student_id:'sample-'+i,name,destination,kind:'check-in',week:currentWeek,mood,need,topic:'',note,
   created_at:new Date(Date.now()-i*7200000).toISOString()};
  answers.split(',').forEach((value,j)=>{record[areas[j][0]]=value;});
  record.priority=priorityFor(record);
  record.status=i===4?'in progress':record.priority==='routine'?'resolved':'open';
  return record;
 });
 // Sample calendar: the urgent sample check-in has one booked call and one cancelled one.
 const slots=exampleSlots();
 const urgent=feedback.find(r=>r.need==='urgent');
 const assign=(slot,status)=>Object.assign(slot,{status,student_name:urgent.name,feedback_id:urgent.id,note:urgent.note});
 assign(slots.find(s=>s.id.startsWith('maria-')&&s.id.endsWith('-1400')),'booked').student_phone='+44 7700 900456';
 Object.assign(assign(slots.find(s=>s.id.startsWith('giorgia-')),'cancelled'),{cancelled_by:'carla@example.com'});
 // Earlier weeks, so the Overview trends and the student pages have a history (all resolved).
 for(let back=1;back<=5;back++){
  const week=new Date(Date.parse(currentWeek+'T12:00:00Z')-back*7*86400000).toISOString().slice(0,10);
  examples.slice(0,6).forEach(([name,destination,mood,,answers],i)=>{
   const record={id:`demo-${i}-w${back}`,student_id:'sample-'+i,name,destination,kind:'check-in',week,
    mood:Math.max(1,Math.min(5,mood+((i+back)%3===0?1:(i+back)%3===1?0:-1)+(back>3&&i===2?2:0))),need:'none',topic:'',note:'',
    created_at:new Date(Date.parse(week+'T16:00:00Z')+i*3600000).toISOString()};
   answers.split(',').forEach((value,j)=>{record[areas[j][0]]=back>2&&value==='difficult'?'ok':value;});
   record.priority=priorityFor(record);record.status='resolved';
   feedback.push(record);
  });
 }
 // Students who already finished, with their final feedback (one with a low score and its follow-up).
 const finished=[['Chiara Esposito','London, UK',-6],['Marco Greco','Cork, Ireland',-12],['Sara Bruno','Calgary, Canada',-20],['Davide Galli','Melbourne, Australia',-3]]
  .map(([name,destination,end],i)=>({id:'finished-'+i,name,destination,email:'finished'+i+'@example.com',start_date:dateAfter(end-180),end_date:dateAfter(end),language:i===1?'en':'it'}));
 const blankFinal={travel:null,best:'',improve:'',advice:'',housing_comment:'',school_comment:'',social_comment:'',local_support_comment:'',team_support_comment:'',followup_id:null,language:'it',future_contact:null};
 const finalRow=(i,values)=>({...blankFinal,id:'final-'+i,student_id:finished[i].id,name:finished[i].name,destination:finished[i].destination,end_date:finished[i].end_date,
  submitted_at:new Date(Date.parse(finished[i].end_date+'T15:00:00Z')+2*86400000).toISOString(),...values});
 const finalFeedback=[
  finalRow(0,{overall:5,recommend:10,housing_type:'family',housing:5,school:4,social:5,local_support:4,team_support:5,travel:4,
   best:'My host family treated me like a daughter and I made friends from five countries.',advice:'Say yes to every invitation in the first weeks!',share_consent:1,future_contact:1}),
  finalRow(1,{overall:4,recommend:8,housing_type:'boarding',housing:4,school:4,social:3,social_comment:'It took me a while to make local friends.',local_support:5,team_support:4,travel:3,
   improve:'More activities with local students in the first month.',share_consent:0,future_contact:1,language:'en'}),
  finalRow(2,{overall:3,recommend:6,housing_type:'family',housing:2,housing_comment:'My host family was often away and I ate alone most evenings.',school:4,social:4,local_support:3,team_support:4,travel:4,
   best:'The school and my classmates.',improve:'Check on host families more often during the stay.',share_consent:1,future_contact:0,followup_id:'demo-final-follow'})];
 feedback.push({id:'demo-final-follow',student_id:'finished-2',name:'Sara Bruno',destination:'Calgary, Canada',kind:'final',week:currentWeek,mood:null,need:'none',topic:'',
  note:'Host family / boarding house 2/5: My host family was often away and I ate alone most evenings.',priority:'follow',status:'open',created_at:new Date(Date.now()-3*3600000).toISOString()});
 feedback.sort((a,b)=>b.created_at.localeCompare(a.created_at));
 const ago=hours=>new Date(Date.now()-hours*3600000).toISOString();
 return {
  students:[...examples.map(([name,destination],i)=>({id:'sample-'+i,name,destination,email:'student'+i+'@example.com',start_date:dateAfter(-60),end_date:dateAfter(90),
   phone:i===2?'+44 7700 900456':'',parent_email:i===2?'parent.romano@example.com':'',language:'it'})),...finished],
  feedback,slots,finalFeedback,finalInvited:finished.map(s=>s.id),
  consultants:consultantList.map(([id,name,phone])=>({id,name,phone,email:id+'@example.com',active:1})),
  activity:[
   {at:ago(2),actor:'carla@example.com',action:'call cancelled',object_type:'slot',details:'Giorgia · Giulia Romano'},
   {at:ago(26),actor:'carla@example.com',action:'recurring availability added',object_type:'slot',details:'maria · 09:00-12:30, 14:00-18:00 · 4 weeks'},
   {at:ago(50),actor:'staff@example.com',action:'student added',object_type:'student',details:'Beatrice Gallo'}],
  day,week:currentWeek,integrations:{sheet:false,reminder:false}
 };
};
const demoKey='gobeyond-demo-v5';
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
const views=[['overview','Overview'],['feedback','Feedback'],['students','Students'],['support','Support queue'],['calendar','Calendar'],['final','Final feedback'],['sheet','Spreadsheet'],['settings','Settings']];
// Response types: weekly check-in, separate message, or the follow-up opened by low scores in the final feedback.
const kindLabel=r=>t(r.kind==='message'?'Message':r.kind==='final'?'Final feedback':'Check-in');

let data,view='overview',demo=false,search='',filter='all';
const active=()=>data.students.filter(s=>s.start_date<=data.day&&s.end_date>=data.day);
const current=()=>data.feedback.filter(r=>r.week===data.week&&r.kind==='check-in');
const queue=()=>data.feedback.filter(r=>r.priority!=='routine'&&r.status!=='resolved').sort((a,b)=>Number(b.priority==='urgent')-Number(a.priority==='urgent')||Number(b.need==='week')-Number(a.need==='week')||b.created_at.localeCompare(a.created_at));
// Short reason a response is in the support queue, e.g. "Contact this week · Difficult: Money".
const queueReason=r=>r.kind==='final'?t('Low scores in the final feedback')
 :[r.need==='week'?t('Contact this week'):'',areaSummary(r),r.topic?t(r.topic):''].filter(Boolean).join(' · ')||r.note||t('Requested support');
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
function feedbackTable(rows,full=false,manage=false){
 const showActions=manage&&!demo;
 const columns=full?['Student','Week of','Type','Mood','Topic','Status']:['Student','Mood','Status'];
 if(!showActions)columns.push('');
 return table(columns,rows.map(r=>{
  const actions=showActions?`<div class="actions record-actions">${rowButton(r)}${removalButton('delete','feedback',r)}</div>`:'';
  return `<tr><td>${person(r)}${actions}</td>${full?`<td>${dateLabel(r.week)}</td><td>${kindLabel(r)}</td>`:''}<td>${moodLabel(r)}</td>${full?`<td>${esc(r.topic?t(r.topic):areaSummary(r))||'—'}</td>`:''}<td>${pill(r)}</td>${showActions?'':`<td>${rowButton(r)}</td>`}</tr>`;
 }),'Feedback appears here as students submit check-ins and messages.');
}
function removalButton(action,type,record,label=t(capital(action)),style='row-link'){
 const name=type==='students'?esc(record.name):t('response from {name}',{name:esc(record.name)});
 return `<button type="button" class="${style}${action==='delete'?' delete-action':''}" data-removal="${action}" data-record-type="${type}" data-record-id="${esc(record.id)}" aria-label="${t(action==='delete'?'Delete {name}':'Restore {name}',{name})}">${label}</button>`;
}
function recentlyDeleted(type,expanded){
 if(demo)return '';
 const students=type==='students';
 const records=(students?data.deletedStudents:data.deletedFeedback)??[];
 const columns=students?['Student','Email','']:['Student','Week of','Type','Topic',''];
 const rows=records.map(record=>`<tr><td>${person(record)}</td>${students
  ?`<td>${esc(record.email)}</td>`
  :`<td>${dateLabel(record.week)}</td><td>${kindLabel(record)}</td><td>${esc(record.topic?t(record.topic):areaSummary(record))||'—'}</td>`}
  <td>${removalButton('restore',type,record)}</td></tr>`);
 return `<details class="card" style="margin-top:16px" ${expanded?'open':''}><summary class="formbody">${t('Recently deleted')}${records.length?` (${records.length})`:''}</summary>
 ${table(columns,rows,students?'No deleted students.':'No deleted responses.')}</details>`;
}

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
 </section>${trendsCard()}`;
}
// Staff calendar: pick a day on the month grid, then a consultant, then see that consultant's slots for the day.
let calDay='',calConsultant='',calMonth='';
function calendarView(){
 const today=callDay(new Date().toISOString());
 const slots=(data.slots||[]).slice().sort((a,b)=>a.starts_at.localeCompare(b.starts_at)||a.consultant_name.localeCompare(b.consultant_name));
 const upcoming=slots.filter(s=>callDay(s.starts_at)>=today);
 const total=status=>upcoming.filter(s=>s.status===status).length;
 const counts=dayCounts(slots);
 calDay||=Object.keys(counts).filter(date=>date>=today).sort()[0]||today;
 calMonth||=calDay.slice(0,7);
 const people=consultantsOf();
 const daySlots=slots.filter(s=>callDay(s.starts_at)===calDay);
 const consultantButtons=people.map(c=>{
  const mine=daySlots.filter(s=>consultantOf(s)===c.id);
  const count=status=>mine.filter(s=>s.status===status).length;
  return `<button type="button" class="consultant-btn${calConsultant===c.id?' selected':''}${isActive(c)?'':' inactive'}" data-cal-consultant="${esc(c.id)}" aria-pressed="${calConsultant===c.id}"><b>${esc(c.name)}${isActive(c)?'':` <span class="pill cancelled">${t('Inactive')}</span>`}</b><small>${esc(c.phone)}</small><small>${mine.length?`${slotLabel('open')}: ${count('open')} · ${slotLabel('booked')}: ${count('booked')}${count('cancelled')?` · ${slotLabel('cancelled')}: ${count('cancelled')}`:''}`:t('No times')}</small></button>`;
 }).join('');
 const person=people.find(c=>c.id===calConsultant);
 const action=s=>s.status==='booked'?`<span class="cell-sub"><button class="row-link danger" data-cancel-slot="${esc(s.id)}">${t('Cancel')}</button></span>`
  :s.status==='open'?`<span class="cell-sub"><button class="row-link muted-link" data-remove-slot="${esc(s.id)}">${t('Remove')}</button></span>`:'';
 const row=s=>`<tr class="slot-${s.status}"><td><b>${callTime(s.starts_at)}–${callTime(s.ends_at)}</b></td><td><span class="pill ${slotClass(s.status)}">${slotLabel(s.status)}</span>${action(s)}${s.status==='cancelled'&&s.cancelled_by?`<span class="cell-sub muted">${t('by {who}',{who:esc(s.cancelled_by)})}</span>`:''}</td><td class="student-cell">${s.student_name?`<span class="student-name">${esc(s.student_name)}</span>${s.student_phone?`<span class="cell-sub">${phoneLink(s.student_phone)}</span>`:''}`:'—'}</td><td class="note-cell">${s.status==='open'?'—':esc(s.note)||t('No written comment.')}</td></tr>`;
 const detailCard=person
  ?`<section class="card"><div class="card-head"><div><h2>${esc(person.name)} · ${callDayLabel(dayOf(calDay))}</h2><p>${phoneLink(person.phone)}</p></div></div>${table(['Time','Status','Student','Check-in note'],daySlots.filter(s=>consultantOf(s)===person.id).map(row),t('No times for {name} on this day.',{name:esc(person.name)}))}</section>`
  :`<section class="card"><p class="empty">${t('Choose a consultant to see their times.')}</p></section>`;
 const hasExamples=slots.some(s=>s.status==='open'&&exampleSlotId(s.id));
 return title('Calendar','Consultant calls booked by students who asked for urgent support.',
   btn('Consultants','consultants','user')+(hasExamples?btn('Remove example times','remove-examples'):'')+btn('Recurring availability','recurring','repeat')+btn('Add availability','add-slots','plus',true))+
  `<div class="calendar-legend">${['open','booked','cancelled'].map(status=>`<span class="pill ${slotClass(status)}">${slotLabel(status)}: ${total(status)}</span>`).join('')}<span class="muted">${t('Times are in Italian time.')}</span><span class="calendar-status" id="page-status" role="status"></span></div>
  <section class="calendar-layout">
   <div class="card cal-card">${monthGrid({month:calMonth,selected:calDay,counts})}<p class="cal-key"><span><i class="dot open"></i>${t('Available times')}</span><span><i class="dot booked"></i>${t('Booked calls')}</span></p></div>
   <div class="card day-card"><div class="card-head"><div><h2>${callDayLabel(dayOf(calDay))}</h2><p>${t('Consultants for this day')}</p></div></div><div class="consultant-list">${consultantButtons}</div></div>
  </section>${detailCard}`;
}
// Confirmation dialog for calendar actions; `apply` does the change (sample data or server).
function confirmDialog(heading,summary,warning,confirmLabel,keepLabel,apply){
 openDialog(heading,`<p class="sub">${summary}</p><p class="footnote">${warning}</p><br>
 <form><p class="error" role="alert"></p><div class="actions"><button class="btn danger">${confirmLabel}</button><button type="button" class="btn" data-keep>${keepLabel}</button></div></form>`);
 const form=detail.querySelector('form');
 form.querySelector('[data-keep]').onclick=()=>detail.close();
 form.onsubmit=async event=>{
  event.preventDefault();
  try{await apply();detail.close();render();}
  catch(error){
   showError(form,error);
   // Someone else may have changed this slot (e.g. a student booked it): refresh the calendar behind the dialog.
   if(!demo)request('/api/data').then(fresh=>{data=fresh;render();}).catch(()=>{});
  }
 };
}
function cancelDialog(slot){
 confirmDialog(t('Cancel appointment?'),
  t('{student} with {consultant}, {day} at {time} (Italian time).',{student:esc(slot.student_name),consultant:esc(slot.consultant_name),day:callDayLabel(slot.starts_at,false),time:callTime(slot.starts_at)}),
  t('The student is not notified automatically, and this time will not be offered again.'),t('Cancel appointment'),t('Keep appointment'),
  async()=>{
   if(demo){const stored=data.slots.find(s=>s.id===slot.id);Object.assign(stored,{status:'cancelled',cancelled_at:new Date().toISOString()});saveDemo(data);}
   else{await request('/api/appointments/cancel',{id:slot.id});data=await request('/api/data');}
  });
}
function removeSlotDialog(slot){
 confirmDialog(t('Remove this time?'),
  t('{consultant}, {day} at {time} (Italian time).',{consultant:esc(slot.consultant_name),day:callDayLabel(slot.starts_at,false),time:callTime(slot.starts_at)}),
  t('Students will no longer be able to book it.'),t('Remove time'),t('Keep time'),
  async()=>{
   if(demo){
    if(!data.slots.some(s=>s.id===slot.id&&s.status==='open'))throw new Error('This time was not found or is no longer open.');
    data.slots=data.slots.filter(s=>s.id!==slot.id);saveDemo(data);
   }else{await request('/api/slots/remove',{id:slot.id});data=await request('/api/data');}
  });
}
// Add availability: back-to-back calls of the chosen length between "From" and "To" (Italian time).
const callLengths=[15,30,45,60];
function rangeTimes(from,to,minutes){
 const toMinutes=value=>{const [h,m]=value.split(':').map(Number);return h*60+m;};
 const times=[];
 for(let m=toMinutes(from);m+minutes<=toMinutes(to);m+=minutes)times.push(String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'));
 return times;
}
const consultantsOf=()=>data.consultants||consultantList.map(([id,name,phone])=>({id,name,phone,active:1}));
const isActive=c=>c.active!==0&&c.active!==false;
const exampleSlotId=slotId=>/^(maria|francesco|giorgia)-\d{4}-\d\d-\d\d-\d{4}$/.test(slotId);
function availabilityDialog(){
 const people=consultantsOf().filter(isActive);
 openDialog(t('Add consultant availability'),`<form>
  <label class="field">${t('Consultant')}<select name="consultant_id" required>${people.map(c=>`<option value="${esc(c.id)}" ${c.id===calConsultant?'selected':''}>${esc(c.name)} · ${esc(c.phone)}</option>`).join('')}</select></label>
  <label class="field">${t('Date')}<input name="date" type="date" required min="${callDay(new Date().toISOString())}" value="${calDay&&calDay>=callDay(new Date().toISOString())?calDay:dateAfter(1)}"></label>
  <div class="field-row"><label class="field">${t('From')}<input name="from" type="time" step="300" required value="09:00"></label><label class="field">${t('To')}<input name="to" type="time" step="300" required value="12:00"></label></div>
  <label class="field">${t('Call length')}<select name="minutes">${callLengths.map(n=>`<option value="${n}" ${n===30?'selected':''}>${t('{n} minutes',{n})}</option>`).join('')}</select></label>
  <p class="slot-preview" id="slot-preview"></p>
  <p class="error" role="alert"></p><button class="btn primary">${t('Add times')}</button></form>`);
 const form=detail.querySelector('form');
 const values=()=>Object.fromEntries(new FormData(form));
 const preview=()=>{
  const v=values();
  const times=v.from&&v.to&&v.to>v.from?rangeTimes(v.from,v.to,Number(v.minutes)):[];
  form.querySelector('#slot-preview').textContent=times.length?t('Times to add: {times}',{times:times.join(', ')})+' · '+t('Times are in Italian time.'):'';
 };
 form.addEventListener('input',preview);
 form.addEventListener('change',preview);
 preview();
 form.onsubmit=async event=>{
  event.preventDefault();
  const v=values();
  try{
   let count;
   if(demo){
    const minutes=Number(v.minutes),person=people.find(c=>c.id===v.consultant_id);
    if(!person||!v.date||!v.from||!v.to)throw new Error('Choose a consultant, a date and a time range.');
    if(v.to<=v.from)throw new Error('The end time must be after the start time.');
    const times=rangeTimes(v.from,v.to,minutes);
    if(!times.length)throw new Error('The time range is shorter than one call.');
    if(times.length>24)throw new Error('Add at most 24 times at once.');
    const added=times.map(time=>{const starts_at=italianTime(v.date,time);return {id:crypto.randomUUID(),consultant_id:person.id,starts_at,ends_at:new Date(Date.parse(starts_at)+minutes*60000).toISOString(),status:'open',consultant_name:person.name,consultant_phone:person.phone,student_name:null,feedback_id:null,note:null};});
    if(added[0].starts_at<=new Date().toISOString())throw new Error('Choose times in the future.');
    if(data.slots.some(s=>consultantOf(s)===person.id&&s.status!=='cancelled'&&s.starts_at<added.at(-1).ends_at&&s.ends_at>added[0].starts_at))throw new Error('Some of these times overlap with this consultant’s existing availability.');
    data.slots.push(...added);saveDemo(data);count=added.length;
   }else{
    count=(await request('/api/slots/add',{...v,minutes:Number(v.minutes)})).added;
    data=await request('/api/data');
   }
   // Show the day and consultant that just got the new times.
   calDay=v.date;calMonth=v.date.slice(0,7);calConsultant=v.consultant_id;
   detail.close();render();
   document.querySelector('#page-status').textContent=t('Times added: {count}.',{count});
  }catch(error){showError(form,error);}
 };
}
function dataView(expandDeleted=false){
 if(view==='overview') return overview();
 if(view==='calendar') return calendarView();
 if(view==='final') return finalView();
 if(view==='students') return title('Students','Manage program dates and personal check-in links.',btn('Add student','add','plus',true))+
  `<section class="card"><div class="card-head"><h2>${t('Student directory')}</h2></div>${table(['Student','Email','Program dates','This week',''],data.students.map(s=>{
   const received=current().some(r=>r.student_id===s.id);
   const state=s.start_date>data.day?'Upcoming':s.end_date<data.day?'Completed':received?'Received':'Awaiting';
   const actions=`<div class="actions record-actions"><button class="row-link" data-student-page="${esc(s.id)}" aria-label="${t('View {name}',{name:esc(s.name)})}">${t('View')}</button><button class="row-link" data-edit-student="${esc(s.id)}" aria-label="${t('Edit {name}',{name:esc(s.name)})}">${t('Edit')}</button><button class="row-link" data-final-student="${esc(s.id)}">${t('Final feedback')}</button>${demo?'':removalButton('delete','students',s)}</div>`;
   return `<tr><td>${person(s)}${actions}</td><td>${esc(s.email)}</td><td>${dateLabel(s.start_date)} – ${dateLabel(s.end_date)}</td><td><span class="pill ${received?'resolved':''}">${t(state)}</span></td><td>${s.token?`<button class="row-link" data-copy="${esc(s.id)}">${t('Copy check-in link')}</button>`:t('Sample student')}</td></tr>`;
  }),'Add a student to begin tracking their weekly check-ins.')}</section><p class="footnote" id="page-status" role="status"></p>`+
  recentlyDeleted('students',expandDeleted);
 if(view==='settings'){
  const staffSignOut=data.staffSession?btn('Sign out','sign-out'):'';
  const {reminderScheduled,reminder,sheet}=data.integrations;
  const reminderCopy=reminderScheduled
   ? 'The email automation checks daily for active students. Each student who has yet to check in gets one email per week, and a reminder four days later if they still haven’t replied. Their personal link opens without an account.'
   : 'Active students who have yet to check in get one email per week, and a reminder four days later if they still haven’t replied.';
  const reminderStatus=reminderScheduled?'Daily check scheduled':reminder?'Webhook configured':'Connection required';
  const sheetAction=externalSheetLink()||`<span class="pill">${t(sheet?'Webhook configured':'Connection required')}</span>`;
  return title('Settings','Manage weekly delivery and spreadsheet syncing.',staffSignOut)+`
   <section class="card formbody">
     <h2>${t('Weekly reminders')}</h2>
     <p class="sub">${t(reminderCopy)}</p>
     <p class="footnote"><span class="pill">${t(reminderStatus)}</span></p>
     <br><h2>${t('Spreadsheet sync')}</h2>
     <p class="sub">${t('Each check-in or message appears immediately in the CRM spreadsheet.')}</p>
     <div class="actions" style="margin:14px 0">${sheetAction}</div>
     ${sheet||reminder?`${btn('Run connected jobs','jobs','clock',true)}<p class="footnote" id="page-status" role="status"></p>`:''}
     <br><h2>${t('Final feedback')}</h2>
     <p class="sub">${t('The final feedback form is sent automatically on each student’s end date, with reminders after 4 and 10 days. It stays open for 30 days.')}</p>
     <br><h2>${t('Privacy')}</h2>
     <p class="sub">${data.integrations.retentionMonths
      ?t('Personal details and written answers are removed {n} months after a program ends. Ratings are kept for statistics.',{n:data.integrations.retentionMonths})
      :t('No automatic removal is set. Set RETENTION_MONTHS on the hosting platform to remove personal details and written answers that many months after a program ends.')}</p>
   </section>${activityCard()}`;
 }
 const sheet=view==='sheet';
 const support=view==='support';
 return title(sheet?'Spreadsheet':support?'Support queue':'Feedback',sheet?'Every submitted check-in and message, in one table.':support?'Review student needs and update follow-up status.':'Review weekly check-ins and messages from students.',sheet?externalSheetLink()+btn('Export CSV','export','download',true):'')+
 `<section class="card"><div class="card-head"><h2>${t(sheet?'Response register':support?'Open follow-ups':'All responses')}</h2></div>
 <div class="filters"><input id="search" type="search" aria-label="${t('Search responses')}" placeholder="${t('Search students or topics')}" value="${esc(search)}"><select id="filter" aria-label="${t('Filter responses')}" style="width:auto">
 <option value="all">${t(support?'All priorities':'All responses')}</option><option value="urgent">${t('Urgent')}</option><option value="follow">${t('Follow-up')}</option>${support?'':`<option value="check-in">${t('Check-ins')}</option><option value="message">${t('Messages')}</option>`}</select></div><div id="filtered"></div></section>`+
 (view==='feedback'?recentlyDeleted('feedback',expandDeleted):'');
}
function filterRows(){
 const result=document.querySelector('#filtered');
 if(!result)return;
 const rows=(view==='support'?queue():data.feedback).filter(r=>
  (filter==='all'||r.kind===filter||r.priority===filter)&&
  [r.name,r.destination,r.topic,t(r.topic),areaSummary(r),r.note].join(' ').toLowerCase().includes(search.toLowerCase()));
 result.innerHTML=view==='sheet'?table(['Submitted','Week of','Student','Destination','Type','Mood',...areas.map(([,label])=>label),'Support','Topic','Feedback','Status',''],rows.map(r=>`<tr><td>${dateLabel(r.created_at)}</td><td>${dateLabel(r.week)}</td><td>${esc(r.name)}</td><td>${esc(r.destination)}</td><td>${esc(t(r.kind))}</td><td>${r.mood??'—'}</td>${areas.map(([key])=>`<td>${r[key]?`<span class="pill ${ratingClass(r[key])}">${esc(ratingLabel(r[key]))}</span>`:'—'}</td>`).join('')}<td>${esc(needLabel(r.need))}</td><td>${esc(t(r.topic))||'—'}</td><td style="max-width:280px;white-space:normal">${esc(r.note)||'—'}</td><td>${pill(r)}</td><td>${rowButton(r)}</td></tr>`)):feedbackTable(rows,true,view==='feedback');
}
function render(expandDeleted=false){
 rerender=()=>render();
 const label=views.find(([name])=>name===view)[1];
 app.innerHTML=`<div class="shell"><aside class="sidebar">${brand}<div class="nav-title">${t('WORKSPACE')}</div><nav aria-label="${t('Workspace')}">${views.map(([name,label])=>`<button class="nav-btn ${view===name?'active':''}" data-action="${name}" ${view===name?'aria-current="page"':''}>${icon(name,18)}${t(label)}${name==='support'&&queue().length?`<span>${queue().length}</span>`:''}</button>`).join('')}</nav><div class="lang-wrap">${langToggle()}</div><div class="sidefoot">${avatar('Gobeyond Team')}<div><b>${t('Gobeyond Team')}</b><small>${t('Student care workspace')}</small></div></div></aside>
 <main><div class="top"><div>${t('Workspace')} <span aria-hidden="true">/</span> <b>${t(label)}</b></div><div>${data.staffSession?btn('Sign out','sign-out'):t(demo?'Sample workspace':'Staff workspace')}</div></div><div class="content">
 ${demo?`<p class="notice">${t('Sample data for trying the portal.')} <a class="row-link" href="/">${t('Open live workspace')}</a></p>`:''}
 <p id="record-notice" class="notice" role="status" hidden></p>
 ${dataView(expandDeleted)}</div></main></div>`;
 const query=document.querySelector('#search');
 if(query){
  query.oninput=()=>{search=query.value;filterRows();};
  const select=document.querySelector('#filter');
  select.value=filter;
  select.onchange=()=>{filter=select.value;filterRows();};
  filterRows();
 }
 // Filters on the Overview trends and the Final feedback tab.
 const bind=(selector,apply)=>{const el=document.querySelector(selector);if(el)el.onchange=()=>{apply(el);render();document.querySelector(selector)?.focus();};};
 bind('#trend-dest',el=>{trendDest=el.value;});
 bind('#final-dest',el=>{finalDest=el.value;});
 bind('#final-month',el=>{finalMonth=el.value;});
 bind('#final-quotes',el=>{finalQuotes=el.checked;});
}
function openDialog(title,body,wide=false){
 detail.classList.toggle('wide',wide);
 detail.innerHTML=`<div class="dialog-head"><h2>${title}</h2><button data-close title="${t('Close')}" aria-label="${t('Close')}">✕</button></div>${body}`;
 detail.querySelector('[data-close]').onclick=()=>detail.close();
 if(!detail.open)detail.showModal();
}
function recordDialog(record){
 const areaRows=areas.filter(([key])=>record[key]).map(([key,label])=>`<li><span>${t(label)}</span><span class="pill ${ratingClass(record[key])}">${esc(ratingLabel(record[key]))}</span></li>`).join('');
 const finalAnswer=record.kind==='final'&&(data.finalFeedback||[]).find(f=>f.followup_id===record.id);
 openDialog(esc(record.name),`<p class="sub">${esc(record.destination)} · ${t('Week of {date}',{date:dateLabel(record.week)})} · ${kindLabel(record)}</p>
 <p style="margin:14px 0">${pill(record)} ${record.mood?faces[record.mood]+' '+t(moods[record.mood]):''}</p>
 ${areaRows?`<ul class="area-list" aria-label="${t('How are these things going?')}">${areaRows}</ul>`:''}
 <strong>${esc(record.topic?t(record.topic):t('Student feedback'))}</strong><p class="record-text">${esc(record.note)||t('No written comment.')}</p>
 <p class="footnote">${t('Support requested:')} ${esc(needLabel(record.need))}</p><br>
 <form><label class="field">${t('Follow-up status')}<select name="status">${options(statuses)}</select></label><p class="error" role="alert"></p>
 <div class="actions"><button class="btn primary">${t('Save status')}</button>${record.kind==='final'
  ?(finalAnswer?`<button type="button" class="btn" data-open-final>${t('Open the final feedback')}</button>`:'')
  :`<button type="button" class="btn" data-edit-response>${t('Edit response')}</button>`}${demo?'':removalButton('delete','feedback',record,t('Delete response'),'btn')}</div></form>`);
 const form=detail.querySelector('form');
 form.querySelector('[data-edit-response]')?.addEventListener('click',()=>editResponseDialog(record));
 form.querySelector('[data-open-final]')?.addEventListener('click',()=>finalDialog(finalAnswer));
 const remove=form.querySelector('[data-removal]');
 if(remove)remove.onclick=()=>changeRemoval(remove,form);
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
function showRecordNotice(message,isError=false){
 const notice=document.querySelector('#record-notice');
 notice.className=isError?'notice error':'notice';
 notice.hidden=false;
 notice.textContent=message;
}
function changeRemoval(button,sourceForm){
 const {removal,recordType,recordId}=button.dataset;
 if(removal==='restore')return saveRemoval(button.dataset,button);
 const isStudent=recordType==='students';
 const record=(isStudent?data.students:data.feedback).find(row=>row.id===recordId);
 if(!record)return;
 const description=isStudent
  ? t('Deleting {name} pauses their check-ins and hides their feedback. Restore the profile from Recently deleted in Students.',{name:esc(record.name)})
  : t('Delete the response from {name}? You can restore it from Recently deleted in Feedback.',{name:esc(record.name)});
 openDialog(t(isStudent?'Delete student?':'Delete response?'),`<form><p class="record-text">${description}</p><p class="error" role="alert"></p>
  <div class="actions"><button type="button" class="btn" data-cancel-delete>${t('Cancel')}</button><button type="submit" class="btn delete-action">${t(isStudent?'Delete student':'Delete response')}</button></div>
 </form>`);
 const form=detail.querySelector('form');
 const cancel=form.querySelector('[data-cancel-delete]');
 const confirmButton=form.querySelector('[type="submit"]');
 cancel.onclick=()=>sourceForm&&!isStudent?recordDialog(record):detail.close();
 cancel.focus();
 form.onsubmit=async event=>{
  event.preventDefault();
  await saveRemoval(button.dataset,confirmButton,form);
 };
}
async function saveRemoval({removal,recordType,recordId},button,form){
 const isStudent=recordType==='students';
 const deleting=removal==='delete';
 button.disabled=true;
 try{
  await request(`/api/${recordType}/${removal}`,{id:recordId});
  data=await request('/api/data');
  if(form&&detail.open&&detail.contains(form))detail.close();
  render(true);
  showRecordNotice(t(deleting
   ?(isStudent?'Student deleted. Restore it from Recently deleted in Students.':'Response deleted. Restore it from Recently deleted in Feedback.')
   :(isStudent?'Student restored.':'Response restored.')));
 }catch(error){
  if(form&&detail.open&&detail.contains(form))showError(form,error);
  else showRecordNotice(t(error.message),true);
 }finally{button.disabled=false;}
}
// Staff edit a response's mood, support request, topic and comment (the "How are these things going?" answers are kept).
function editResponseDialog(record){
 const message=record.kind==='message';
 openDialog(t('Edit response'),`<form>
 ${message?'':`<label class="field">${t('Mood')}<select name="mood" required><option value="">${t('Choose a mood')}</option>${moods.slice(1).map((mood,i)=>`<option value="${i+1}">${t(mood)}</option>`).join('')}</select></label>`}
 <label class="field">${t('Support requested')}<select name="need" required>${needs.map(([value,label])=>`<option value="${value}">${t(label)}</option>`).join('')}</select></label>
 <label class="field">${t('Topic (optional)')}<select name="topic"><option value="">${t('Choose a topic')}</option>${options(topics)}</select></label>
 <label class="field">${t(message?'Message':'Written feedback (optional)')}<textarea name="note" maxlength="2000" ${message?'required':''}></textarea></label>
 <p class="error" role="alert"></p><div class="actions"><button type="submit" class="btn primary">${t('Save response')}</button><button type="button" class="btn" data-cancel>${t('Cancel')}</button></div></form>`);
 const form=detail.querySelector('form');
 if(!message)form.elements.mood.value=record.mood??'';
 form.elements.need.value=record.need;
 form.elements.topic.value=record.topic??'';
 form.elements.note.value=record.note??'';
 form.querySelector('[data-cancel]').onclick=()=>recordDialog(record);
 form.querySelector('select').focus();
 form.onsubmit=async event=>{
  event.preventDefault();
  const button=form.querySelector('[type="submit"]');
  button.disabled=true;
  const fields=Object.fromEntries(new FormData(form));
  const changes={id:record.id,mood:message?null:Number(fields.mood),need:fields.need,topic:fields.topic,note:fields.note.trim()};
  try{
   if(message&&!changes.note)throw new Error('Enter a message before saving.');
   if(demo){
    const priority=priorityFor({...record,...changes});
    let status=record.status;
    if(priority==='routine')status='resolved';
    else if(record.priority==='routine'||(status==='resolved'&&priority==='urgent'&&record.priority!=='urgent'))status='open';
    Object.assign(record,changes,{priority,status});
    saveDemo(data);
   }else{
    await request('/api/feedback/update',changes);
    data=await request('/api/data');
   }
   const updated=data.feedback.find(row=>row.id===record.id);
   render();
   if(detail.open&&detail.contains(form)){
    if(updated)recordDialog(updated);
    else detail.close();
   }
  }catch(error){showError(form,error);}
  finally{button.disabled=false;}
 };
}
function addDialog(student){
 openDialog(t(student?'Edit student':'Add a student'),`<form>${textField('Full name','name','text','maxlength="100"')}${textField('Email','email','email','maxlength="254"')}${textField('Destination','destination','text','maxlength="120"')}<div class="field-row">${textField('Program start','start_date','date')}${textField('Program end','end_date','date')}</div>
  <div class="field-row"><label class="field">${t('Phone or WhatsApp (optional)')}<input name="phone" type="tel" maxlength="25" autocomplete="off"></label>
  <label class="field">${t('Email language')}<select name="language"><option value="">${t('Automatic (Italian until the student chooses)')}</option><option value="it">Italiano</option><option value="en">English</option></select></label></div>
  <label class="field">${t('Parent email for emergencies (optional)')}<input name="parent_email" type="email" maxlength="254"><small class="muted">${t('Never used for check-ins or the final feedback form.')}</small></label>
  <p class="error" role="alert"></p><button type="submit" class="btn primary">${t(student?'Save changes':'Add student')}</button></form>`);
 const form=detail.querySelector('form');
 if(student){
  for(const name of ['name','email','destination','start_date','end_date','phone','parent_email','language'])form.elements[name].value=student[name]??'';
 }
 form.onsubmit=async event=>{
  event.preventDefault();
  const button=form.querySelector('[type="submit"]');
  button.disabled=true;
  const fields=Object.fromEntries(new FormData(form));
  try{
   if(fields.start_date>fields.end_date)throw new Error('Choose an end date on or after the start date.');
   if(demo){
    if(data.students.some(s=>s.id!==student?.id&&s.email.toLowerCase()===fields.email.toLowerCase()))throw new Error('This student email already exists.');
    if(student){
     Object.assign(student,fields);
     for(const row of data.feedback.filter(r=>r.student_id===student.id)){
      row.name=student.name;
      row.destination=student.destination;
     }
    }else data.students.push({...fields,id:crypto.randomUUID()});
    saveDemo(data);
   }else{
    if(student)await request('/api/students/update',{...fields,id:student.id});
    else await request('/api/students',fields);
    data=await request('/api/data');
   }
   if(detail.open&&detail.contains(form))detail.close();
   render();
  }catch(error){showError(form,error);}
  finally{button.disabled=false;}
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
 if(button.dataset.removal){await changeRemoval(button);return;}
 if(views.some(([key])=>key===action)){view=action;search='';filter='all';render();return;}
 if(action==='add')addDialog();
 if(action==='sign-out'){
  try{await request('/api/staff/sign-out',{});location.assign('/');}
  catch(error){openDialog(t('Sign out'),`<p class="error">${esc(t(error.message))}</p>`);}
 }
 if(button.dataset.editStudent){
  const student=data.students.find(s=>s.id===button.dataset.editStudent);
  if(student)addDialog(student);
 }
 if(action==='add-slots')availabilityDialog();
 if(action==='recurring')recurringDialog();
 if(action==='consultants')consultantsDialog();
 if(action==='remove-examples')removeExamplesDialog();
 if(action==='export-final')downloadFinal();
 if(button.dataset.final){
  const answer=(data.finalFeedback||[]).find(r=>r.id===button.dataset.final);
  if(answer)finalDialog(answer);
 }
 if(button.dataset.finalStudent){
  const student=data.students.find(s=>s.id===button.dataset.finalStudent);
  if(student)finalStudentDialog(student);
 }
 if(button.dataset.studentPage){
  const student=data.students.find(s=>s.id===button.dataset.studentPage);
  if(student)studentDialog(student);
 }
 if(button.dataset.copyQuote){
  const answer=(data.finalFeedback||[]).find(r=>r.id===button.dataset.copyQuote);
  if(answer){
   const quote=`“${answer.best||answer.advice}” — ${answer.name.split(' ')[0]}, ${answer.destination}`;
   try{await navigator.clipboard.writeText(quote);button.textContent=t('Copied');}
   catch{openDialog(t('Copy'),`<label class="field">${t('Copy this text')}<textarea readonly>${esc(quote)}</textarea></label>`);}
  }
 }
 // Staff calendar: month arrows, day, consultant.
 const {calMonth:month,calDay:pickedDay,calConsultant:pickedConsultant}=button.dataset;
 if(month||pickedDay||pickedConsultant){
  if(month)calMonth=month;
  if(pickedDay){calDay=pickedDay;calMonth=pickedDay.slice(0,7);}
  if(pickedConsultant)calConsultant=pickedConsultant;
  const restore=refocus(button,app);
  render();restore();
  return;
 }
 if(button.dataset.removeSlot){
  const slot=(data.slots||[]).find(s=>s.id===button.dataset.removeSlot);
  if(slot)removeSlotDialog(slot);
 }
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
 if(button.dataset.cancelSlot){
  const slot=(data.slots||[]).find(s=>s.id===button.dataset.cancelSlot);
  if(slot)cancelDialog(slot);
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
 // Optional consultant call booking, offered when the student answers "Yes, it's urgent".
 // Order: pick a day on the calendar -> pick a consultant -> pick one of their times. The chosen slot travels in a hidden field.
 let slotsState='idle',slotList=[],slotPeople=[],chosenSlot='',pickDay='',pickConsultant='',viewMonth='';
 // The consultant calls the student, so booking asks for a phone (filled in if we already have it). laterBooking = a call booked later from this link.
 let bookingPhone=student.phone||'',laterBooking=null;
 async function loadSlots(){
  const {slots,consultants}=preview
   ?{slots:readDemo().slots.filter(s=>s.status==='open'&&s.starts_at>new Date().toISOString()),consultants:consultantList.map(([id,name])=>({id,name}))}
   :await request('/api/slots',{token});
  // Everything offered to students is open (the server only sends open slots, without a status field).
  return {consultants,slots:slots.map(s=>({...s,status:'open'})).sort((a,b)=>a.starts_at.localeCompare(b.starts_at)||a.consultant_name.localeCompare(b.consultant_name))};
 }
 function fetchSlots(){
  slotsState='loading';
  loadSlots().then(result=>{slotList=result.slots;slotPeople=result.consultants;slotsState='ready';}).catch(()=>{slotList=[];slotsState='error';})
   .finally(()=>{const box=document.querySelector('#booking');if(box&&!box.hidden)box.innerHTML=slotPicker();});
 }
 function slotPicker(){
  if(slotsState==='idle')fetchSlots();
  const head=`<h3>${t('Book a call with a consultant (optional)')}</h3><p class="muted">${t('Choose a time if you’d like to talk to one of our consultants. Times are in Italian time.')}</p>`;
  if(slotsState==='loading')return head+`<p class="muted">${t('Loading available times…')}</p>`;
  if(slotsState==='error')return head+`<p class="muted">${t('Available times could not be loaded. Your team will contact you.')}</p>`;
  if(!slotList.length)return head+`<p class="muted">${t('No times are available right now. Your team will contact you.')}</p>`;
  if(chosenSlot&&!slotList.some(s=>s.id===chosenSlot))chosenSlot='';
  const counts=dayCounts(slotList);
  if(pickDay&&!counts[pickDay])pickDay='';
  viewMonth||=(pickDay||callDay(slotList[0].starts_at)).slice(0,7);
  const people=slotPeople.length?slotPeople:[...new Map(slotList.map(s=>[consultantOf(s),{id:consultantOf(s),name:s.consultant_name}])).values()];
  const daySlots=pickDay?slotList.filter(s=>callDay(s.starts_at)===pickDay):[];
  const consultantStep=pickDay
   ?`<div class="pick-step"><b>${t('Consultant')}</b><div class="consultant-list">${people.map(c=>{
     const count=daySlots.filter(s=>consultantOf(s)===c.id).length;
     return `<button type="button" class="consultant-btn${pickConsultant===c.id?' selected':''}" data-cal-consultant="${esc(c.id)}" aria-pressed="${pickConsultant===c.id}" ${count?'':'disabled'}><b>${esc(c.name)}</b><small>${count?t('Available: {count}',{count}):t('No times')}</small></button>`;
    }).join('')}</div></div>`
   :`<p class="muted pick-hint">${t('Choose a day with available times. Days with times are marked with a dot.')}</p>`;
  const person=people.find(c=>c.id===pickConsultant);
  const times=pickDay&&person?daySlots.filter(s=>consultantOf(s)===person.id):[];
  const timeStep=!pickDay?'':!person?`<p class="muted pick-hint">${t('Choose a consultant to see their times.')}</p>`
   :`<div class="pick-step"><b>${t('Time')}</b>${times.length?`<div class="slot-grid">${times.map(s=>{
     const local=localCallTime(s.starts_at);
     return `<button type="button" class="slot-btn${chosenSlot===s.id?' selected':''}" data-cal-slot="${esc(s.id)}" aria-pressed="${chosenSlot===s.id}"><b>${callTime(s.starts_at)}</b>${local?`<small>${esc(local)}</small>`:''}</button>`;
    }).join('')}</div>`:`<p class="muted">${t('No times for {name} on this day.',{name:esc(person.name)})}</p>`}</div>`;
  const chosen=slotList.find(s=>s.id===chosenSlot);
  const summary=chosen?`<p class="pick-summary" role="status">${t('Selected: {day} at {time} with {name}',{day:callDayLabel(chosen.starts_at,false),time:callTime(chosen.starts_at),name:esc(chosen.consultant_name)})}<button type="button" class="row-link" data-cal-clear="1">${t('No call for now')}</button></p>
   <label class="field phone-field">${t('Your phone or WhatsApp number')}<input name="phone" type="tel" autocomplete="tel" maxlength="25" value="${esc(bookingPhone)}" placeholder="+39 333 123 4567"><small class="muted">${t('The consultant will call you on this number.')}</small></label>`:'';
  return head+`<input type="hidden" name="slot" value="${esc(chosenSlot)}"><div class="pick-layout"><div class="pick-step"><b>${t('Day')}</b>${monthGrid({month:viewMonth,selected:pickDay,counts,disabled:date=>!counts[date]?.open})}</div><div>${consultantStep}${timeStep}</div></div>${summary}`;
 }
 // Clicks inside the booking box: change month, day, consultant or time, then redraw the box.
 function wireBooking(box){
  box.addEventListener('click',event=>{
   const button=event.target.closest('button');
   if(!button||!box.contains(button))return;
   const {calMonth,calDay,calConsultant,calSlot,calClear}=button.dataset;
   if(calMonth)viewMonth=calMonth;
   else if(calDay){pickDay=calDay;viewMonth=calDay.slice(0,7);}
   else if(calConsultant)pickConsultant=calConsultant;
   else if(calSlot)chosenSlot=calSlot;
   else if(calClear)chosenSlot='';
   else return;
   const restore=refocus(button,box);
   box.innerHTML=slotPicker();
   restore();
  });
  box.addEventListener('input',event=>{if(event.target.name==='phone')bookingPhone=event.target.value;});
 }
 const needsPhone=()=>{if(!bookingPhone.trim())throw new Error('Enter a phone number so the consultant can call you.');};
 function demoBook(slotId,record){
  const mock=readDemo();
  const existing=mock.slots.find(s=>s.feedback_id===record.id&&s.status==='booked');
  if(existing)return {status:'booked',slot:existing};
  const slot=mock.slots.find(s=>s.id===slotId);
  if(!slot||slot.status!=='open'||slot.starts_at<=new Date().toISOString())return {status:'taken'};
  Object.assign(slot,{status:'booked',student_name:record.name,student_phone:bookingPhone,feedback_id:record.id,note:record.note||'',booked_at:new Date().toISOString()});
  saveDemo(mock);
  return {status:'booked',slot};
 }
 function bookingSummary(slot){
  const local=localCallTime(slot.starts_at);
  return `<div class="booked-box"><b>${t('Call booked with {name}',{name:esc(slot.consultant_name)})}</b><p>${t('{day} at {time} (Italian time)',{day:callDayLabel(slot.starts_at),time:callTime(slot.starts_at)})}${local?' · '+esc(local):''}</p>${slot.consultant_phone?`<p>${t('Consultant’s phone: {phone}',{phone:phoneLink(slot.consultant_phone)})}</p>`:''}</div>`;
 }
 function thanks(message,booking=null,record=null){
  rerender=()=>thanks(message,booking,record);
  const extra=booking?.status==='booked'?bookingSummary(booking.slot)
   :booking?.status==='taken'?`<p class="notice">${t('That time was just booked by someone else. Your check-in is saved. Choose another time or skip.')}</p><form id="rebook"><section class="booking" id="booking">${slotPicker()}</section><p class="error" role="alert"></p><div class="actions"><button type="submit" class="btn primary">${t('Book call')}</button><button type="button" class="btn" id="skip-call">${t('Skip')}</button></div></form><br>`
   :'';
  app.innerHTML=shell(t('Thanks for sharing'),t('Your response has been saved.'),`${extra}<p class="muted">${t(message?'Your Gobeyond team has received your message.':'Your Gobeyond team has received your check-in.')}</p><button id="another" class="btn primary">${t('Send another message')}</button> ${preview?`<a href="/?demo=1" class="btn">${t('Open sample workspace')}</a>`:''}`);
  document.querySelector('#another').onclick=()=>{submissionId=crypto.randomUUID();kind='message';form();};
  const rebook=document.querySelector('#rebook');
  if(!rebook)return;
  wireBooking(rebook.querySelector('#booking'));
  document.querySelector('#skip-call').onclick=()=>thanks(message,null,record);
  rebook.onsubmit=async event=>{
   event.preventDefault();
   const button=rebook.querySelector('button[type=submit]');
   const slotId=new FormData(rebook).get('slot');
   try{
    if(!slotId)throw new Error('Choose a time first.');
    needsPhone();
    button.disabled=true;
    const result=preview?demoBook(slotId,record):(await request('/api/book',{token,feedback_id:record.id,slot:slotId,phone:bookingPhone,language:lang})).booking;
    if(result.status!=='booked'){slotsState='idle';chosenSlot='';}
    thanks(message,result,record);
   }catch(error){showError(rebook,error);button.disabled=false;}
  };
 }
 function form(values={}){
  const message=kind==='message';
  app.innerHTML=shell(t(message?'Message your team':'Your weekly check-in'),`${student.name?t('Hi {name}. ',{name:esc(student.name.split(' ')[0])}):''}${t(message?'Send a question or ask for help.':'How has your week abroad been?')}`,`
   ${preview?`<p class="notice">${t('Sample form. Your response will appear in the sample workspace on this browser.')}</p>`:''}
   ${student.submitted?`<p class="notice">${t('Your check-in for this week is saved. You can still send a message.')}</p>`:''}
   ${laterBooking?bookingSummary(laterBooking.slot)
    :message&&!preview&&student.urgent&&!student.urgent.booked?`<section class="later-booking"><p class="notice">${t('You told us this week that it’s urgent. You can still book a call with a consultant.')}</p><form id="later-book" novalidate><section class="booking" id="booking">${slotPicker()}</section><p class="error" role="alert"></p><div class="actions"><button type="submit" class="btn primary">${t('Book call')}</button></div></form></section>`:''}
   <div class="actions" style="margin-bottom:17px">${student.submitted?'':`<button class="btn" id="switch-kind">${t(message?'Back to weekly check-in':'Send a separate message')}</button>`}</div>
   <form id="checkin-form">
   ${message?'':`<fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('How are you feeling this week?')}</legend><div class="choices">${faces.slice(1).map((face,i)=>`<label><input type="radio" name="mood" value="${i+1}" required><span><b aria-hidden="true">${face}</b>${t(moods[i+1])}</span></label>`).join('')}</div></fieldset>
   <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:4px">${t('How are these things going?')}</legend><div class="areas">${areas.map(([key,label])=>`<div class="area-row" role="radiogroup" aria-label="${t(label)}"><span class="area-name">${t(label)}</span><div class="scale">${ratings.map(([value,text])=>`<label><input type="radio" name="${key}" value="${value}" required><span class="${value}">${t(text)}</span></label>`).join('')}</div></div>`).join('')}</div></fieldset>`}
   <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('Do you need support from us with anything?')}</legend><div class="support-options">${needs.map(([value,label])=>`<label><input type="radio" name="need" value="${value}" required><span>${t(label)}</span></label>`).join('')}</div></fieldset>
   ${message?'':'<section class="booking" id="booking" hidden></section>'}
   ${message?`<label class="field">${t('What is this about? (optional)')}<select name="topic"><option value="">${t('Choose a topic')}</option>${options(topics)}</select></label>`:''}
   <label class="field">${t(message?'What would you like to tell us?':'Anything else you’d like to tell us or ask? (optional)')}<textarea name="note" maxlength="2000" ${message?'required':''} placeholder="${t('A question, something that went well, or something you’d like help with')}"></textarea></label>
   <p class="muted privacy-line">${t('Only the Go Beyond team can read your answers. We use them to support you and to improve our programs.')}</p><p class="error" role="alert"></p>
   <button type="submit" class="btn primary">${t(message?'Send message':'Submit check-in')}</button></form>`);
  const element=app.querySelector('#checkin-form');
  // Book later: an urgent check-in this week without a call can still book one from this link.
  const later=app.querySelector('#later-book');
  if(later){
   wireBooking(later.querySelector('#booking'));
   later.onsubmit=async event=>{
    event.preventDefault();
    const button=later.querySelector('button[type=submit]');
    const slotId=new FormData(later).get('slot');
    try{
     if(!slotId)throw new Error('Choose a time first.');
     needsPhone();
     button.disabled=true;
     const result=(await request('/api/book',{token,feedback_id:student.urgent.id,slot:slotId,phone:bookingPhone,language:lang})).booking;
     if(result.status==='booked'){student.urgent.booked=true;laterBooking=result;form(Object.fromEntries(new FormData(element)));}
     else{slotsState='idle';chosenSlot='';later.querySelector('#booking').innerHTML=slotPicker();throw new Error('This time is no longer available. Choose another time.');}
    }catch(error){showError(later,error);button.disabled=false;}
   };
  }
  // Keep anything the student already filled in when the language changes.
  for(const [name,value] of Object.entries(values))if(element.elements[name])element.elements[name].value=value;
  rerender=()=>form(Object.fromEntries(new FormData(element)));
  const toggle=document.querySelector('#switch-kind');
  if(toggle)toggle.onclick=()=>{kind=message?'check-in':'message';form();};
  // Show the call booking only while "Yes, it's urgent" is selected.
  const bookingBox=element.querySelector('#booking');
  const syncBooking=()=>{
   if(!bookingBox)return;
   bookingBox.hidden=element.elements.need.value!=='urgent';
   if(!bookingBox.hidden)bookingBox.innerHTML=slotPicker();
  };
  element.addEventListener('change',event=>{if(event.target.name==='need')syncBooking();});
  if(bookingBox)wireBooking(bookingBox);
  syncBooking();
  element.onsubmit=async event=>{
   event.preventDefault();
   const button=element.querySelector('button[type=submit]');
   button.disabled=true;
   const input={...Object.fromEntries(new FormData(element)),kind,token,id:submissionId,language:lang};
   if(message||input.need!=='urgent'||!input.slot){delete input.slot;delete input.phone;}
   try{
    if(message&&!input.note.trim())throw new Error('Enter a message before sending.');
    if(input.slot)needsPhone();
    let booking=null;
    const record={id:submissionId,name:'Sample submission',note:input.note||''};
    if(preview){
     const mock=readDemo();
     const stored={...input,topic:input.topic??'',id:submissionId,week:currentWeek,student_id:'preview',name:'Sample submission',destination:'Demo',mood:message?null:Number(input.mood),created_at:new Date().toISOString()};
     delete stored.slot;
     stored.priority=priorityFor(stored);
     stored.status=stored.priority==='routine'?'resolved':'open';
     mock.feedback.unshift(stored);
     saveDemo(mock);
     if(input.slot)booking=demoBook(input.slot,record);
    }else booking=(await request('/api/submit',input)).booking||null;
    if(booking?.status==='taken'){slotsState='idle';chosenSlot='';}
    student.submitted ||= !message;
    thanks(message,booking,record);
   }catch(error){showError(element,error);button.disabled=false;}
  };
 }
 form();
}
// ===== Shared helpers for the new staff views =====
const average=values=>{const known=values.filter(v=>v!=null&&v!=='').map(Number);return known.length?known.reduce((a,b)=>a+b,0)/known.length:null;};
const oneDecimal=n=>n==null?'—':new Intl.NumberFormat(locale(),{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
const stars=n=>`<span class="stars" role="img" aria-label="${n}/5">${'★'.repeat(n)}<span class="dim">${'★'.repeat(5-n)}</span></span>`;
const weekShift=(week,n)=>new Date(Date.parse(week+'T12:00:00Z')+n*7*86400000).toISOString().slice(0,10);
// A small line chart of mood (1-5) over weeks: faces on the left, week labels underneath.
function moodChart(points){
 const W=560,H=170,left=40,right=14,top=12,bottom=34;
 const x=i=>left+i*(W-left-right)/Math.max(1,points.length-1);
 const y=v=>top+(5-v)/4*(H-top-bottom);
 const known=points.map((p,i)=>({...p,i})).filter(p=>p.value!=null);
 const line=known.map((p,j)=>`${j?'L':'M'}${x(p.i).toFixed(1)} ${y(p.value).toFixed(1)}`).join('');
 return `<svg class="mood-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('Average mood')}">${[1,2,3,4,5].map(v=>`<line x1="${left}" x2="${W-right}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${left-10}" y="${y(v)+5}" text-anchor="end" class="axis">${faces[v]}</text>`).join('')}
  <path d="${line}" class="line"/>${known.map(p=>`<circle cx="${x(p.i)}" cy="${y(p.value)}" r="4.5" class="dot"><title>${esc(p.label)}: ${oneDecimal(p.value)}${p.n>1?` (${p.n})`:''}</title></circle>`).join('')}
  ${points.map((p,i)=>`<text x="${x(i)}" y="${H-10}" text-anchor="middle" class="axis">${esc(p.label)}</text>`).join('')}</svg>`;
}
// Overview: average mood and "Difficult" answers per area over the last 8 weeks, optionally for one destination.
let trendDest='all';
function trendsCard(){
 if(!data.feedback.some(r=>r.kind==='check-in'))return '';
 const weeks=[...Array(8)].map((_,i)=>weekShift(data.week,i-7));
 const destinations=[...new Set(data.students.map(s=>s.destination))].sort();
 const checks=data.feedback.filter(r=>r.kind==='check-in'&&weeks.includes(r.week)&&(trendDest==='all'||r.destination===trendDest));
 const perWeek=weeks.map(week=>{const rows=checks.filter(r=>r.week===week);return {week,n:rows.length,mood:average(rows.map(r=>r.mood)),hard:Object.fromEntries(areas.map(([key])=>[key,rows.filter(r=>r[key]==='difficult').length]))};});
 const most=Math.max(1,...perWeek.flatMap(p=>Object.values(p.hard)));
 const heat=`<div class="table-wrap"><table class="heat"><thead><tr><th>${t('“Difficult” answers')}</th>${perWeek.map(p=>`<th>${dateLabel(p.week)}</th>`).join('')}</tr></thead><tbody>${areas.map(([key,label])=>`<tr><td>${t(label)}</td>${perWeek.map(p=>`<td class="heat-cell level-${p.hard[key]?Math.ceil(p.hard[key]/most*3):0}">${p.hard[key]||''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 return `<section class="card trends"><div class="card-head"><div><h2>${t('Trends over the last 8 weeks')}</h2><p>${t('Average mood and “Difficult” answers per area, from weekly check-ins.')}</p></div><select id="trend-dest" aria-label="${t('Destination')}" style="width:auto"><option value="all">${t('All destinations')}</option>${destinations.map(x=>`<option value="${esc(x)}" ${x===trendDest?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
  <div class="trend-body"><div><h3>${t('Average mood')}</h3>${moodChart(perWeek.map(p=>({label:dateLabel(p.week),value:p.mood,n:p.n})))}</div><div><h3>${t('Where students struggle')}</h3>${heat}</div></div></section>`;
}
// Settings: who did what.
function activityCard(){
 return `<section class="card" style="margin-top:16px"><div class="card-head"><div><h2>${t('Recent activity')}</h2><p>${t('Who did what in the workspace.')}</p></div></div>${table(['When','Who','What','Details'],(data.activity||[]).map(a=>`<tr><td>${dateLabel(a.at,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</td><td>${esc(a.actor)}</td><td>${esc(capital(t(a.action)))}</td><td class="note-cell">${esc(a.details||'')}</td></tr>`),'No activity yet.')}</section>`;
}
// Staff student page: contact details, mood week by week, the five areas, every response, calls and the final feedback.
function studentDialog(s){
 const rows=data.feedback.filter(r=>r.student_id===s.id).sort((a,b)=>a.created_at.localeCompare(b.created_at));
 const checks=rows.filter(r=>r.kind==='check-in').slice(-8);
 const ids=new Set(rows.map(r=>r.id));
 const calls=(data.slots||[]).filter(x=>x.feedback_id&&ids.has(x.feedback_id)).sort((a,b)=>a.starts_at.localeCompare(b.starts_at));
 const final=(data.finalFeedback||[]).find(r=>r.student_id===s.id);
 const facts=[['Email',esc(s.email)],['Phone or WhatsApp',s.phone?phoneLink(s.phone):'—'],['Parent email (emergencies)',s.parent_email?esc(s.parent_email):'—'],
  ['Email language',s.language==='en'?'English':s.language==='it'?'Italiano':t('Automatic')],['Program dates',`${dateLabel(s.start_date)} – ${dateLabel(s.end_date)}`]];
 const grid=`<div class="table-wrap"><table class="heat"><thead><tr><th>${t('Week of')}</th>${areas.map(([,label])=>`<th>${t(label)}</th>`).join('')}</tr></thead><tbody>${checks.map(r=>`<tr><td>${dateLabel(r.week)}</td>${areas.map(([key])=>`<td>${r[key]?`<span class="pill ${ratingClass(r[key])}">${esc(ratingLabel(r[key]))}</span>`:'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 openDialog(esc(s.name),`<p class="sub">${esc(s.destination)}</p>
  <dl class="facts">${facts.map(([k,v])=>`<div><dt>${t(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>
  ${checks.length?`<h3>${t('Mood week by week')}</h3>${moodChart(checks.map(r=>({label:dateLabel(r.week),value:r.mood,n:1})))}<h3>${t('How things went, week by week')}</h3>${grid}`:`<p class="empty">${t('No weekly check-ins yet.')}</p>`}
  <h3>${t('All responses')}</h3>${rows.length?`<ul class="timeline">${rows.slice().reverse().map(r=>`<li><button class="row-link" data-open-record="${esc(r.id)}">${dateLabel(r.created_at)} · ${kindLabel(r)}</button> ${pill(r)} <span class="muted">${esc((r.note||areaSummary(r)||'').slice(0,120))}</span></li>`).join('')}</ul>`:`<p class="empty">${t('No responses yet.')}</p>`}
  <h3>${t('Calls')}</h3>${calls.length?`<ul class="timeline">${calls.map(c=>`<li>${callDayLabel(c.starts_at)} ${callTime(c.starts_at)} · ${esc(c.consultant_name)} <span class="pill ${slotClass(c.status)}">${slotLabel(c.status)}</span></li>`).join('')}</ul>`:`<p class="empty">${t('No calls booked.')}</p>`}
  <h3>${t('Final feedback')}</h3>${final?`<p>${stars(final.overall)} · ${t('Recommend')}: ${final.recommend}/10 · <button class="row-link" data-open-final-answer>${t('View answers')}</button></p>`:`<p class="empty">${t('Not received yet.')}</p>`}`,true);
 detail.querySelectorAll('[data-open-record]').forEach(b=>{b.onclick=()=>recordDialog(data.feedback.find(r=>r.id===b.dataset.openRecord));});
 detail.querySelector('[data-open-final-answer]')?.addEventListener('click',()=>finalDialog(final));
}
// Consultants: add, edit, deactivate (inactive = hidden from students and from new availability).
function consultantsDialog(editing=null){
 const people=consultantsOf();
 const c=editing||{id:'',name:'',phone:'',email:'',active:1};
 openDialog(t('Consultants'),`${table(['Consultant','Phone','Email','Status',''],people.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.phone)}</td><td>${esc(p.email||'—')}</td><td><span class="pill ${isActive(p)?'resolved':'cancelled'}">${t(isActive(p)?'Active':'Inactive')}</span></td><td><button class="row-link" data-edit-consultant="${esc(p.id)}">${t('Edit')}</button></td></tr>`))}
  <form class="consultant-form"><h3>${c.id?t('Edit {name}',{name:esc(c.name)}):t('Add a consultant')}</h3>
  <div class="field-row"><label class="field">${t('Name')}<input name="name" required maxlength="60" value="${esc(c.name)}"></label><label class="field">${t('Phone')}<input name="phone" type="tel" required maxlength="25" value="${esc(c.phone)}"></label></div>
  <label class="field">${t('Email (gets a copy of booking emails)')}<input name="email" type="email" maxlength="254" value="${esc(c.email||'')}"></label>
  <label class="check"><input type="checkbox" name="active" ${isActive(c)?'checked':''}> ${t('Active: students can book this consultant')}</label>
  <p class="error" role="alert"></p><div class="actions"><button class="btn primary">${t(c.id?'Save changes':'Add consultant')}</button>${c.id?`<button type="button" class="btn" data-new-consultant>${t('Add a new consultant instead')}</button>`:''}</div></form>`,true);
 detail.querySelectorAll('[data-edit-consultant]').forEach(b=>{b.onclick=()=>consultantsDialog(people.find(p=>p.id===b.dataset.editConsultant));});
 detail.querySelector('[data-new-consultant]')?.addEventListener('click',()=>consultantsDialog());
 const form=detail.querySelector('form');
 form.onsubmit=async event=>{
  event.preventDefault();
  const v=Object.fromEntries(new FormData(form));
  const payload={id:c.id,name:(v.name||'').trim(),phone:(v.phone||'').trim(),email:(v.email||'').trim(),active:!!v.active};
  try{
   if(demo){
    if(!payload.name||(payload.phone.match(/\d/g)||[]).length<6)throw new Error('Check the consultant’s name, phone and email.');
    data.consultants??=consultantsOf();
    if(c.id){
     Object.assign(data.consultants.find(p=>p.id===c.id),{...payload,active:payload.active?1:0});
     for(const slot of data.slots)if(consultantOf(slot)===c.id)Object.assign(slot,{consultant_name:payload.name,consultant_phone:payload.phone});
    }else data.consultants.push({...payload,id:payload.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+Math.random().toString(16).slice(2,6),active:payload.active?1:0});
    saveDemo(data);
   }else{await request('/api/consultants/save',payload);data=await request('/api/data');}
   render();consultantsDialog();
  }catch(error){showError(form,error);}
 };
}
// Recurring availability: weekdays x time blocks (default 09:00-12:30 and 14:00-18:00, Italian time) for a number of weeks.
function recurringDialog(){
 const people=consultantsOf().filter(isActive);
 const nextMonday=[...Array(7)].map((_,i)=>dateAfter(i+1)).find(d=>new Date(d+'T12:00:00Z').getUTCDay()===1);
 const dayNames=[1,2,3,4,5,6,7].map(n=>[n,capital(new Intl.DateTimeFormat(locale(),{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2024,0,n))))]);
 openDialog(t('Recurring availability'),`<form>
  <label class="field">${t('Consultant')}<select name="consultant_id"><option value="all">${t('All active consultants')}</option>${people.map(c=>`<option value="${esc(c.id)}" ${c.id===calConsultant?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
  <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:8px">${t('Days')}</legend><div class="day-picks">${dayNames.map(([n,name])=>`<label><input type="checkbox" name="weekdays" value="${n}" ${n<=5?'checked':''}><span>${esc(name)}</span></label>`).join('')}</div></fieldset>
  <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:8px">${t('Time blocks (Italian time)')}</legend>
   <div class="field-row"><label class="field">${t('Morning from')}<input name="from1" type="time" step="300" value="09:00"></label><label class="field">${t('to')}<input name="to1" type="time" step="300" value="12:30"></label></div>
   <div class="field-row"><label class="field">${t('Afternoon from')}<input name="from2" type="time" step="300" value="14:00"></label><label class="field">${t('to')}<input name="to2" type="time" step="300" value="18:00"></label></div>
   <small class="muted">${t('Leave a block empty to skip it.')}</small></fieldset>
  <div class="field-row three"><label class="field">${t('Call length')}<select name="minutes">${callLengths.map(n=>`<option value="${n}" ${n===30?'selected':''}>${t('{n} minutes',{n})}</option>`).join('')}</select></label>
   <label class="field">${t('Starting')}<input name="start_date" type="date" required min="${callDay(new Date().toISOString())}" value="${nextMonday}"></label>
   <label class="field">${t('Number of weeks')}<select name="weeks">${[1,2,3,4,6,8,12].map(n=>`<option value="${n}" ${n===4?'selected':''}>${n}</option>`).join('')}</select></label></div>
  <p class="slot-preview" id="recurring-preview"></p><p class="error" role="alert"></p><button class="btn primary">${t('Add these times')}</button></form>`,true);
 const form=detail.querySelector('form');
 const values=()=>{const f=new FormData(form);return {consultant_id:f.get('consultant_id'),weekdays:f.getAll('weekdays').map(Number),
  blocks:[[f.get('from1'),f.get('to1')],[f.get('from2'),f.get('to2')]].filter(([from,to])=>from&&to).map(([from,to])=>({from,to})),
  minutes:Number(f.get('minutes')),start_date:f.get('start_date'),weeks:Number(f.get('weeks'))};};
 const preview=()=>{
  const v=values();
  const perDay=v.blocks.reduce((n,b)=>n+(b.to>b.from?rangeTimes(b.from,b.to,v.minutes).length:0),0);
  const count=v.consultant_id==='all'?people.length:1;
  form.querySelector('#recurring-preview').textContent=perDay&&v.weekdays.length
   ?t('About {n} times in total ({per} per consultant per day). Times in the past or already taken are skipped.',{n:perDay*v.weekdays.length*v.weeks*count,per:perDay}):'';
 };
 form.addEventListener('input',preview);form.addEventListener('change',preview);preview();
 form.onsubmit=async event=>{
  event.preventDefault();
  const v=values(),button=form.querySelector('button');
  try{
   if(!v.weekdays.length||!v.blocks.length||!v.start_date)throw new Error('Choose consultants, days, time blocks, a start date and a number of weeks.');
   button.disabled=true;
   let result;
   if(demo)result=demoRecurring(v);
   else{result=await request('/api/slots/recurring',v);data=await request('/api/data');}
   calDay=v.start_date;calMonth=v.start_date.slice(0,7);if(v.consultant_id!=='all')calConsultant=v.consultant_id;
   detail.close();render();
   document.querySelector('#page-status').textContent=t('Times added: {count}. Skipped: {skipped}.',{count:result.added,skipped:result.skipped});
  }catch(error){showError(form,error);button.disabled=false;}
 };
}
function demoRecurring(v){
 const people=v.consultant_id==='all'?consultantsOf().filter(isActive):consultantsOf().filter(c=>c.id===v.consultant_id);
 const nowIso=new Date().toISOString();
 let added=0,skipped=0;
 for(let offset=0;offset<v.weeks*7;offset++){
  const date=new Date(Date.parse(v.start_date+'T12:00:00Z')+offset*86400000).toISOString().slice(0,10);
  if(!v.weekdays.includes((new Date(date+'T12:00:00Z').getUTCDay()+6)%7+1))continue;
  for(const block of v.blocks)for(const time of rangeTimes(block.from,block.to,v.minutes))for(const p of people){
   const starts_at=italianTime(date,time),ends_at=new Date(Date.parse(starts_at)+v.minutes*60000).toISOString();
   if(starts_at<=nowIso||data.slots.some(s=>consultantOf(s)===p.id&&s.status!=='cancelled'&&s.starts_at<ends_at&&s.ends_at>starts_at)){skipped++;continue;}
   data.slots.push({id:crypto.randomUUID(),consultant_id:p.id,starts_at,ends_at,status:'open',consultant_name:p.name,consultant_phone:p.phone,student_name:null,feedback_id:null,note:null});
   added++;
  }
 }
 saveDemo(data);
 return {added,skipped};
}
function removeExamplesDialog(){
 const count=(data.slots||[]).filter(s=>s.status==='open'&&exampleSlotId(s.id)).length;
 confirmDialog(t('Remove example times?'),t('{n} open example times were created when the app first started.',{n:count}),
  t('Booked and cancelled calls stay. Times you added yourself are not touched.'),t('Remove example times'),t('Keep them'),
  async()=>{
   if(demo){data.slots=data.slots.filter(s=>!(s.status==='open'&&exampleSlotId(s.id)));saveDemo(data);}
   else{await request('/api/slots/remove-examples',{});data=await request('/api/data');}
  });
}

// ===== Final feedback (end of journey) =====
// Questions 4-9: [key, short name for staff, question for students]; question 4 depends on where they lived; travel is optional.
const finalTopicList=[['housing','Host family / boarding house',''],['school','School and teaching','School life and the quality of teaching'],
 ['social','Friends','Making friends with international and local students'],['local_support','Local Coordinator / Tutor','Support on site from your Local Coordinator and/or Tutor'],
 ['team_support','Go Beyond team','Support from the Go Beyond team in Italy, before and during your stay'],['travel','Travel and arrival','Travel and arrival organisation']];
const finalRequired=['housing','school','social','local_support','team_support'];
const housingLabels={family:'Host family',boarding:'Boarding house',other:'Other'};
const housingQuestion=type=>type==='boarding'?'Life in the boarding house':type==='family'?'Life with your host family':'Life with your host family / in the boarding house';
const scaleWord=n=>tIn('scale',['Very poor','Poor','Fair','Good','Excellent'].at(n-1));
const npsGroup=n=>n>=9?'promoter':n>=7?'passive':'detractor';
const npsLabel=n=>t(npsGroup(n)==='promoter'?'Promoter':npsGroup(n)==='passive'?'Passive':'Detractor');
const npsScore=rows=>rows.length?Math.round((rows.filter(r=>r.recommend>=9).length-rows.filter(r=>r.recommend<=6).length)/rows.length*100):null;
const lowTopics=r=>finalRequired.filter(k=>r[k]!=null&&r[k]<=2);
const finalLink=s=>location.origin+'/final#'+s.token;
let finalDest='all',finalMonth='all',finalQuotes=false;
function finalView(){
 const rows=data.finalFeedback||[];
 const people=new Map(data.students.map(s=>[s.id,s]));
 for(const r of rows)if(!people.has(r.student_id))people.set(r.student_id,{id:r.student_id,destination:r.destination,end_date:r.end_date});
 const invitedIds=new Set([...(data.finalInvited||[]),...rows.map(r=>r.student_id)]);
 const pool=[...invitedIds].map(id=>people.get(id)).filter(Boolean);
 const inFilter=s=>(finalDest==='all'||s.destination===finalDest)&&(finalMonth==='all'||(s.end_date||'').slice(0,7)===finalMonth);
 const responses=rows.filter(inFilter), invited=pool.filter(inFilter).length;
 const destinations=[...new Set(pool.map(s=>s.destination))].sort();
 const months=[...new Set(pool.map(s=>(s.end_date||'').slice(0,7)))].filter(Boolean).sort().reverse();
 const monthName=m=>capital(new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(m+'-15T12:00:00Z')));
 const rate=invited?Math.round(responses.length/invited*100):null, nps=npsScore(responses);
 const bars=finalTopicList.map(([key,name])=>{const avg=average(responses.map(r=>r[key]));
  return `<div class="topic-bar"><span class="topic-name">${t(name)}</span><span class="bar-track"><span class="bar-fill${avg!=null&&avg<3?' low':''}" style="width:${avg==null?0:avg/5*100}%"></span></span><b>${oneDecimal(avg)}</b></div>`;}).join('');
 const quotes=responses.filter(r=>r.share_consent&&(r.best||r.advice));
 const list=finalQuotes
  ?(quotes.length?`<div class="quotes">${quotes.map(r=>`<figure class="quote"><blockquote>${esc(r.best||r.advice)}</blockquote>${r.best&&r.advice?`<p class="muted">${t('Advice')}: ${esc(r.advice)}</p>`:''}<figcaption>${esc(r.name.split(' ')[0])} · ${esc(r.destination)} · ${stars(r.overall)}</figcaption><button class="row-link" data-copy-quote="${esc(r.id)}">${t('Copy')}</button></figure>`).join('')}</div>`
   :`<p class="empty">${t('No testimonials with consent yet.')}</p>`)
  :table(['Student','Program end','Overall','Recommend','Low scores',''],responses.map(r=>`<tr><td>${person(r)}</td><td>${dateLabel(r.end_date)}</td><td>${stars(r.overall)}</td><td>${r.recommend} <span class="pill ${npsGroup(r.recommend)}">${npsLabel(r.recommend)}</span></td><td>${lowTopics(r).map(k=>`<span class="pill follow">${t(finalTopicList.find(x=>x[0]===k)[1])}</span>`).join(' ')||'—'}</td><td><button class="row-link" data-final="${esc(r.id)}">${t('View')}</button></td></tr>`),
   'Final feedback appears here when students finish their program and answer the form.');
 return title('Final feedback','What students tell us when their program ends.',btn('Export CSV','export-final','download')+`<a class="btn primary" href="/final?demo=1" target="_blank" rel="noopener">${icon('link',16)} ${t('Preview final form')}</a>`)+
  `<section class="card"><div class="filters final-filters"><select id="final-dest" aria-label="${t('Destination')}" style="width:auto"><option value="all">${t('All destinations')}</option>${destinations.map(x=>`<option value="${esc(x)}" ${x===finalDest?'selected':''}>${esc(x)}</option>`).join('')}</select>
   <select id="final-month" aria-label="${t('Program end')}" style="width:auto"><option value="all">${t('All end months')}</option>${months.map(m=>`<option value="${m}" ${m===finalMonth?'selected':''}>${monthName(m)}</option>`).join('')}</select>
   <label class="check"><input type="checkbox" id="final-quotes" ${finalQuotes?'checked':''}> ${t('Testimonials only')}</label></div></section>
  <section class="metrics" aria-label="${t('Final feedback summary')}">
   ${metric('Invited',invited,t('Students sent the form'),'final')}
   ${metric('Responses received',responses.length,rate==null?t('No invitations yet'):t('{rate}% response rate',{rate}),'feedback','green')}
   ${metric('Overall rating',oneDecimal(average(responses.map(r=>r.overall))),t('Average out of 5'),'final','purple')}
   ${metric('Recommendation score',nps==null?'—':(nps>0?'+':'')+nps,t('NPS: % 9–10 minus % 0–6'),'students','orange')}
  </section>
  <section class="grid">
   <div class="card"><div class="card-head"><div><h2>${t(finalQuotes?'Testimonials':'Responses')}</h2><p>${t(finalQuotes?'Only students who agreed to share their words.':'Newest first')}</p></div></div>${list}</div>
   <div class="card"><div class="card-head"><div><h2>${t('Average by topic')}</h2><p>${t('Out of 5. Below 3 is highlighted.')}</p></div></div><div class="topic-bars">${bars}</div></div>
  </section>`;
}
function finalDialog(r){
 const follow=r.followup_id&&data.feedback.find(f=>f.id===r.followup_id);
 const topics=finalTopicList.map(([key,name])=>r[key]==null?'':`<li><span>${t(name)}${r[key+'_comment']?`<small>${esc(r[key+'_comment'])}</small>`:''}</span><span class="pill ${r[key]<=2?'follow':r[key]>=4?'resolved':''}">${r[key]} · ${scaleWord(r[key])}</span></li>`).join('');
 openDialog(esc(r.name),`<p class="sub">${esc(r.destination)} · ${t('Program end')} ${dateLabel(r.end_date)} · ${t('Sent on {date}',{date:dateLabel(r.submitted_at)})} · ${r.language==='it'?'Italiano':'English'}</p>
  <div class="final-score"><div><b>${stars(r.overall)}</b><small>${t('Overall')}</small></div><div><b>${r.recommend}/10</b><small>${npsLabel(r.recommend)}</small></div><div><b>${t(housingLabels[r.housing_type]||'Other')}</b><small>${t('Where they lived')}</small></div></div>
  <ul class="area-list final-topics">${topics}</ul>
  ${[['best','Best part'],['improve','Hardest part / to improve'],['advice','Advice for future students']].map(([k,label])=>r[k]?`<strong>${t(label)}</strong><p class="record-text">${esc(r[k])}</p>`:'').join('')}
  <p class="footnote">${t('Share comments publicly')}: <b>${t(r.share_consent?'Yes':'No')}</b> · ${t('Future programs')}: <b>${r.future_contact==null?'—':t(r.future_contact?'Yes':'No')}</b></p>
  ${follow?`<div class="actions" style="margin-top:14px"><button class="btn" data-open-follow>${t('Open the follow-up')}</button></div>`:''}`);
 detail.querySelector('[data-open-follow]')?.addEventListener('click',()=>recordDialog(follow));
}
// From the Students tab: the student's final feedback status, link and "send now".
function finalStudentDialog(s){
 const answer=(data.finalFeedback||[]).find(r=>r.student_id===s.id);
 const invited=(data.finalInvited||[]).includes(s.id);
 const status=answer?t('Received on {date}',{date:dateLabel(answer.submitted_at)}):invited?t('Sent, waiting for an answer'):t('Not sent yet');
 openDialog(t('Final feedback form'),`<p class="sub">${esc(s.name)} · ${t('Program end')} ${dateLabel(s.end_date)}</p><p class="footnote"><span class="pill ${answer?'resolved':''}">${status}</span></p><br>
  <p class="muted">${t('The form opens 3 days before the end of the program and closes 30 days after it. The invitation is sent automatically on the end date, with reminders after 4 and 10 days.')}</p><br>
  ${s.token?`<label class="field">${t('Final feedback link')}<input readonly value="${esc(finalLink(s))}"></label>`:`<p class="muted">${t('Sample student')}</p>`}
  <form><p class="error" role="alert"></p><div class="actions">${answer||!s.token?'':`<button class="btn primary">${t('Send the form by email now')}</button>`}${s.token?`<button type="button" class="btn" data-copy-final>${t('Copy link')}</button>`:''}${answer?`<button type="button" class="btn" data-view-final>${t('View answers')}</button>`:''}</div><p class="footnote" role="status" id="final-send-status"></p></form>`);
 const form=detail.querySelector('form');
 detail.querySelector('[data-copy-final]')?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(finalLink(s));form.querySelector('#final-send-status').textContent=t('Link copied.');}catch{detail.querySelector('input[readonly]')?.select();}
 });
 detail.querySelector('[data-view-final]')?.addEventListener('click',()=>finalDialog(answer));
 form.onsubmit=async event=>{
  event.preventDefault();
  const button=form.querySelector('button.primary');
  try{
   button.disabled=true;
   await request('/api/final/send',{id:s.id});
   data=await request('/api/data');render();
   form.querySelector('#final-send-status').textContent=t('Sent.');
  }catch(error){showError(form,error);button.disabled=false;}
 };
}
function downloadFinal(){
 const yesNo=v=>v==null?'':t(v?'Yes':'No');
 const cols=[[t('Sent on'),r=>r.submitted_at],[t('Student'),r=>r.name],[t('Destination'),r=>r.destination],[t('Program end'),r=>r.end_date],[t('Overall'),r=>r.overall],[t('Recommend (0–10)'),r=>r.recommend],
  [t('Where they lived'),r=>t(housingLabels[r.housing_type]||'Other')],
  ...finalTopicList.flatMap(([key,name])=>[[t(name),r=>r[key]??''],...(key==='travel'?[]:[[t(name)+' – '+t('comment'),r=>r[key+'_comment']]])]),
  [t('Best part'),r=>r.best],[t('Hardest part / to improve'),r=>r.improve],[t('Advice for future students'),r=>r.advice],
  [t('Share comments publicly'),r=>yesNo(r.share_consent)],[t('Future programs'),r=>yesNo(r.future_contact)],[t('Language'),r=>r.language]];
 const cell=value=>{let raw=String(value??'');if(/^[\s]*[=+@-]|^[\t\r\n]/.test(raw))raw="'"+raw;return '"'+raw.replaceAll('"','""')+'"';};
 const csv=[cols.map(c=>cell(c[0])).join(','),...(data.finalFeedback||[]).map(r=>cols.map(c=>cell(c[1](r))).join(','))].join('\r\n');
 const url=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='gobeyond-final-feedback-'+data.day+'.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
// The student's final feedback form: three short steps, answers kept across steps and language switches.
async function finalPage(){
 const query=new URLSearchParams(location.search),preview=query.has('demo'),token=location.hash.slice(1);
 const shell=(heading,sub,body)=>`<main class="formpage">${formTop()}<section class="hero"><div><div class="eyebrow">${icon('final',16)} ${t('End of your journey')}</div><h2>${heading}</h2><p>${sub}</p></div></section><section class="card formbody">${body}</section></main>`;
 let info;
 try{info=preview?{name:'',submitted:false}:await request('/api/final',{token});}
 catch(error){const page=()=>{app.innerHTML=shell(t('Your Go Beyond experience'),t('Tell us how your program went.'),`<p class="error">${esc(t(error.message))}</p>`);};rerender=page;page();return;}
 const finished=already=>{const page=()=>{app.innerHTML=shell(t('Thank you!'),t(already?'You have already sent your final feedback.':'Your final feedback has been saved.'),
  `<p class="muted">${t('Thank you for helping us make Go Beyond better for the students who come after you.')}</p>${preview?`<a href="/?demo=1" class="btn">${t('Open sample workspace')}</a>`:''}`);};rerender=page;page();};
 if(info.submitted){finished(true);return;}
 const answers={share_consent:'no'}, opened=new Set();
 let step=1;
 const stepNames=['Overall','Your stay','Your words'];
 const filled=key=>answers[key]!=null&&answers[key]!=='';
 const scale=(name,label)=>`<div class="scale5" role="radiogroup" aria-label="${esc(label)}">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="${name}" value="${n}" ${String(answers[name])===String(n)?'checked':''}><span><b>${n}</b><small>${scaleWord(n)}</small></span></label>`).join('')}</div>`;
 const topicBlock=([key,,question])=>{
  const label=key==='housing'?t(housingQuestion(answers.housing_type)):t(question);
  const low=finalRequired.includes(key)&&filled(key)&&Number(answers[key])<=2;
  const show=low||opened.has(key)||(answers[key+'_comment']||'').trim();
  return `<fieldset class="final-topic"><legend>${label}${finalRequired.includes(key)?'':` <span class="muted">${t('(optional)')}</span>`}</legend>${scale(key,label)}
   ${key==='travel'?'':show?`<label class="field comment-field">${t(low?'Tell us what went wrong':'Comment (optional)')}<textarea name="${key}_comment" maxlength="1000" rows="2">${esc(answers[key+'_comment']||'')}</textarea></label>`
    :`<button type="button" class="row-link add-comment" data-open-comment="${key}">+ ${t('Add a comment')}</button>`}</fieldset>`;
 };
 const yesNo=(name,question,optional=false)=>`<fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t(question)}${optional?` <span class="muted">${t('(optional)')}</span>`:''}</legend><div class="support-options yes-no">${[['yes','Yes'],['no','No']].map(([v,l])=>`<label><input type="radio" name="${name}" value="${v}" ${answers[name]===v?'checked':''}><span>${t(l)}</span></label>`).join('')}</div></fieldset>`;
 const body=()=>step===1
  ?`<fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('Overall, how was your experience abroad?')}</legend>${scale('overall',t('Overall, how was your experience abroad?'))}</fieldset>
   <fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('How likely are you to recommend Go Beyond to a friend?')}</legend><div class="nps" role="radiogroup" aria-label="${t('How likely are you to recommend Go Beyond to a friend?')}">${[...Array(11).keys()].map(n=>`<label><input type="radio" name="recommend" value="${n}" ${String(answers.recommend)===String(n)?'checked':''}><span>${n}</span></label>`).join('')}</div><div class="nps-ends"><span>0 · ${t('Not at all likely')}</span><span>10 · ${t('Extremely likely')}</span></div></fieldset>`
  :step===2
  ?`<fieldset class="field" style="border:0;padding:0"><legend style="margin-bottom:9px">${t('Where did you live?')}</legend><div class="support-options housing-options">${Object.entries(housingLabels).map(([v,l])=>`<label><input type="radio" name="housing_type" value="${v}" ${answers.housing_type===v?'checked':''}><span>${t(l)}</span></label>`).join('')}</div></fieldset>
   <p class="muted rate-hint">${t('Rate each part of your stay from 1 (very poor) to 5 (excellent).')}</p>${finalTopicList.map(topicBlock).join('')}`
  :`<label class="field">${t('What was the best part of your experience?')} <span class="muted">${t('(optional)')}</span><textarea name="best" maxlength="2000">${esc(answers.best||'')}</textarea></label>
   <label class="field">${t('What was the hardest part, or what should we improve?')} <span class="muted">${t('(optional)')}</span><textarea name="improve" maxlength="2000">${esc(answers.improve||'')}</textarea></label>
   <label class="field">${t('One piece of advice for a student leaving for the same destination')} <span class="muted">${t('(optional)')}</span><textarea name="advice" maxlength="2000">${esc(answers.advice||'')}</textarea></label>
   ${yesNo('share_consent','Can we share your comments with your first name and destination on our website and social media?')}
   ${yesNo('future_contact','Would you like to hear about future Go Beyond programs?',true)}`;
 const missing=()=>{throw new Error('Please complete the required fields.');};
 const validate=()=>{
  if(step===1&&(!filled('overall')||!filled('recommend')))missing();
  if(step===2){
   if(!filled('housing_type')||finalRequired.some(key=>!filled(key)))missing();
   if(finalRequired.some(key=>Number(answers[key])<=2&&!(answers[key+'_comment']||'').trim()))throw new Error('Tell us what went wrong for each topic you rated 1 or 2.');
  }
  if(step===3&&!filled('share_consent'))missing();
 };
 const saveDemoFinal=p=>{
  const mock=readDemo(), finalId='final-'+crypto.randomUUID(), num=k=>p[k]===''||p[k]==null?null:Number(p[k]);
  const row={id:finalId,student_id:'preview',name:'Sample submission',destination:'Demo',end_date:day,submitted_at:new Date().toISOString(),language:lang,
   overall:num('overall'),recommend:num('recommend'),housing_type:p.housing_type,travel:num('travel'),best:p.best||'',improve:p.improve||'',advice:p.advice||'',
   share_consent:p.share_consent==='yes'?1:0,future_contact:p.future_contact?(p.future_contact==='yes'?1:0):null,followup_id:null};
  for(const key of finalRequired){row[key]=num(key);row[key+'_comment']=(p[key+'_comment']||'').trim();}
  const low=finalRequired.filter(key=>row[key]<=2);
  if(low.length){
   row.followup_id='follow-'+finalId;
   mock.feedback.unshift({id:row.followup_id,student_id:'preview',name:'Sample submission',destination:'Demo',kind:'final',week:currentWeek,mood:null,need:'none',topic:'',
    note:low.map(key=>`${finalTopicList.find(x=>x[0]===key)[1]} ${row[key]}/5: ${row[key+'_comment']}`).join('\n'),priority:'follow',status:'open',created_at:new Date().toISOString()});
  }
  mock.finalFeedback=[row,...(mock.finalFeedback||[])];
  saveDemo(mock);
 };
 const draw=(focusName,focusValue)=>{
  rerender=()=>draw();
  app.innerHTML=shell(t('Your Go Beyond experience'),`${info.name?t('Hi {name}. ',{name:esc(info.name.split(' ')[0])}):''}${t('Your program has ended: tell us how it went. It takes less than 4 minutes.')}`,`
   ${preview?`<p class="notice">${t('Sample form. Your answers will appear in the sample workspace on this browser.')}</p>`:''}
   <div class="progress" aria-hidden="true"><span style="width:${Math.round(step/3*100)}%"></span></div><p class="step-label">${t('Step {n} of 3',{n:step})} · ${t(stepNames.at(step-1))}</p>
   <form id="final-form" novalidate>${body()}<p class="muted privacy-line">${t('Only the Go Beyond team can read your answers. We use them to support you and to improve our programs.')}</p><p class="error" role="alert"></p>
   <div class="actions step-actions">${step>1?`<button type="button" class="btn" data-step-back>${t('Back')}</button>`:''}<button type="submit" class="btn primary">${t(step<3?'Next':'Send my feedback')}</button></div></form>`);
  const form=app.querySelector('#final-form');
  form.addEventListener('input',event=>{if(event.target.name)answers[event.target.name]=event.target.value;});
  form.addEventListener('change',event=>{
   const {name,value}=event.target;
   if(!name)return;
   answers[name]=value;
   if(name==='housing_type'||finalRequired.includes(name))draw(name,value);
  });
  form.querySelectorAll('[data-open-comment]').forEach(b=>{b.onclick=()=>{opened.add(b.dataset.openComment);draw();app.querySelector(`textarea[name="${b.dataset.openComment}_comment"]`)?.focus();};});
  form.querySelector('[data-step-back]')?.addEventListener('click',()=>{step--;draw();window.scrollTo(0,0);});
  if(focusName)form.querySelector(`input[name="${focusName}"][value="${focusValue}"]`)?.focus();
  form.onsubmit=async event=>{
   event.preventDefault();
   const button=form.querySelector('button[type=submit]');
   try{
    validate();
    if(step<3){step++;draw();window.scrollTo(0,0);return;}
    button.disabled=true;
    if(preview)saveDemoFinal(answers);
    else await request('/api/final/submit',{...answers,token,language:lang});
    finished(false);
   }catch(error){showError(form,error);button.disabled=false;}
  };
 };
 draw();
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
function showStaffInvite(invite){
 history.replaceState(null,'',location.pathname);
 const page=()=>{
  app.innerHTML=`<main class="formpage">${formTop()}<section class="card formbody"><h1>${t('Gobeyond staff access')}</h1>
  <p class="sub" style="margin-bottom:16px">${t('Open the staff workspace with your personal staff link.')}</p>
  <form><p class="error" role="alert"></p><button class="btn primary">${t('Open staff workspace')}</button></form></section></main>`;
  const form=app.querySelector('form');
  form.onsubmit=async event=>{
   event.preventDefault();
   form.querySelector('button').disabled=true;
   try{await request('/api/staff/sign-in',{invite});location.replace('/');}
   catch(error){showError(form,error);form.querySelector('button').disabled=false;}
  };
 };
 rerender=page;page();
}
async function boot(){
 document.documentElement.lang=lang;
 document.title=t('Gobeyond Student Care');
 if(location.pathname==='/'&&location.hash.startsWith('#staff=')){showStaffInvite(location.hash.slice(7));return;}
 if(location.pathname==='/check-in'){await formPage();return;}
 if(location.pathname==='/final'){await finalPage();return;}
 if(new URLSearchParams(location.search).has('demo')){demo=true;data=readDemo();render();return;}
 rerender=()=>{app.innerHTML=`<main class="formpage"><p>${t('Loading student care workspace…')}</p></main>`;};
 rerender();
 try{data=await request('/api/data');}
 catch(error){
  const signIn=()=>{
   const signInLink=error.status===401?`<a class="btn primary" href="/signin-with-chatgpt?return_to=%2F" target="_top">${t('Sign in with ChatGPT')}</a>`:'';
   app.innerHTML=`<main class="formpage">${formTop()}<section class="card formbody"><h1>${t('Staff workspace')}</h1><p class="sub" style="margin-bottom:16px">${esc(t(error.message))}</p><p class="muted">${t('You can also open the personal staff sign-in link sent to your email.')}</p>${signInLink}</section></main>`;
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
