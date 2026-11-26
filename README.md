# Gobeyond Student Care

The shared CRM database powers the overview, feedback register, spreadsheet view, and follow-up queue. Use the Students page to register a student's program dates and copy their personal check-in link. Students can submit one check-in per Madrid calendar week, and can send separate messages throughout their program.

The weekly check-in asks four things: mood (1–5), how studies, housing/host family, social life & friends, health & wellbeing and money are going (good / OK / difficult), whether the student needs support (no / yes, not urgent / yes, contact me this week / yes, urgent), and an optional comment. Separate messages ask for support, an optional topic and the message.

## Consultant calls

In the weekly check-in, once the student answers "Do you need support from us?" (any answer), the form shows an optional "Book a call" step: the student picks a day on a month calendar (days with open times are marked), then one of the consultants listed for that day (Maria, Francesco, Giorgia), then one of that consultant's open times. Staff browse the Calendar page in the same order: day, consultant, then that consultant's slots for the day. Booking is optional: the check-in is saved either way, and a student whose chosen time was taken in the meantime can pick another or skip on the thank-you page. A slot can only be booked once, and a check-in can hold at most one booking. Times are stored in UTC and shown in Italian time (students also see their own local time when it differs).

For the selected day and consultant, staff see every slot (open, booked or cancelled) with the student, the consultant's phone number and the note from the check-in. Staff can cancel a booked appointment; the student is not notified automatically and the cancelled time is not offered again. Consultants and slots live in the `consultants` and `slots` tables (`drizzle/0005_consultant_calendar.sql`). The first time the app runs with no slots it creates example slots for the next three working days.

Staff manage availability on the Calendar page. "Add availability" takes a consultant, a date, a from–to range and a call length (15, 30, 45 or 60 minutes) and creates back-to-back open slots in Italian time, up to 24 at once; times in the past or overlapping that consultant's open or booked slots are refused (a cancelled time can be offered again). "Remove" deletes an open slot. Booked and cancelled slots cannot be removed, so no booking or its history is lost.

Booking asks for the student's phone or WhatsApp number (the consultant calls the student); it is shown on the Calendar and kept on the student record. A student whose check-in this week has no call yet sees a "Book a call" panel whenever they open their link again. When a call is booked or cancelled, a `call-booked` / `call-cancelled` event goes to the reminder webhook for the student (consultant in `cc`), with a calendar invite (`ics`, Italian time). Staff manage consultants (name, phone, email, active) from the Calendar page; inactive consultants are hidden from students and from new availability. "Recurring availability" adds the chosen weekdays and time blocks (default 09:00–12:30 and 14:00–18:00) for 1–12 weeks, skipping past and overlapping times. "Remove example times" deletes the open example slots created on first run.

## Final feedback (end of the program)

Every student receives a short final feedback form when their program ends: overall rating (1–5), recommendation (0–10, NPS), where they lived, ratings for host family / boarding house, school and teaching, friends, Local Coordinator / Tutor, the Go Beyond team and travel (1–5, with optional comments), best part, hardest part / what to improve, advice for future students, consent to share their words, and interest in future programs. It is in English and Italian and goes to students only.

The form lives on the student's personal link at `/final#<token>` and is open from 3 days before to 30 days after their end date; each student can answer once. The daily job sends the invitation on the end date and reminders 4 and 10 days later (each only after the previous one went out), and stops once the student answers. Staff can also send it from the student's row. A rating of 1 or 2 on a stay topic requires a comment and opens a follow-up in the Support queue. The **Final feedback** tab shows invited and received counts, response rate, average overall rating, NPS, averages per topic, the list of answers, testimonials with consent, and a CSV export. Answers are in the `final_feedback` table (`drizzle/0006_final_feedback.sql`).

## Follow-ups

An explicit urgent request is flagged urgent. A low mood rating, any "difficult" area, any other request for support, a separate message, a 1–2 rating in the final feedback, or a booked call opens a follow-up. Requests to be contacted this week are listed first after urgent ones. Staff can mark follow-ups in progress or resolved. CSV export includes all responses.

## Student page, trends, activity and privacy

Clicking **View** on a student opens their page: contact details (phone, parent email for emergencies only, email language), mood week by week, the five areas over time, every response, calls and the final feedback. The Overview shows average mood and "Difficult" answers per area over the last 8 weeks, filterable by destination. Settings lists recent staff actions (who added, edited, deleted or restored records, cancelled calls, removed or added times, sent final forms) from the `audit_log` table (`drizzle/0007_audit_log.sql`). Both student forms tell students that only the Go Beyond team reads their answers. Set `RETENTION_MONTHS` to remove a student's personal details and written answers that many months after their program ends (ratings stay for statistics); without it nothing is removed automatically.

Emails follow the student's language: the language they used on a form, or the one set on their record; Italian until they choose. Final feedback emails with no known language are sent in Italian and English together. New columns on existing tables (`students.phone`, `parent_email`, `language`, `anonymized_at`, `consultants.email`, `active`, `slots.student_phone`, `cancelled_by`) are added by the app on first run.

## Passport, visa, family, school, emergency contacts and documents

Consultants add these by hand. In **Add student**, press **Add** to choose any of: Passport (number, issuing country, issue and expiry date), Visa (type, status: to apply / applied / approved / refused / not needed, number, valid from/until), Host family / residence (type, name, address, phone, email, from, notes), School (name, address, contact person, phone, email, grade, start date), Emergency contact (name, relationship, phone, email) and Document (title, category, expiry, https link). A section can be added more than once (e.g. two emergency contacts). Every item can carry one file (PDF, JPG, PNG, WEBP, HEIC or Word, up to 1 MB; large photos are shrunk in the browser before upload). Everything is checked before the student is saved, so nothing is half-saved.

Later, **Add a detail** on a student's row (or **Add** on their page) offers the same options; each item can be edited or removed, and its file opened. The Students table shows how many of the five key details (passport, visa, family, school, emergency contact) each student has, what is missing, and **Check expiry** when a passport or visa expires before the program ends or anything has already expired.

Details are in `student_items` (fields as JSON) and files in `student_files` (base64, one per item) — `drizzle/0008_student_details.sql`; the app also creates both tables on first run. Only staff can see them; adding, editing, removing and opening a file are recorded in the activity log (without passport or visa numbers). Deleting a student hides their details until restored, and the `RETENTION_MONTHS` rule deletes them completely. Files live in the database, so keep them small; for larger scans, connect file storage (e.g. R2) first.

## Running locally

Run `npm run dev` with Node.js 24 or later. The local preview uses a SQLite file and simulates a staff session. Use sample data only for testing. `npm run build` packages the hosted Worker. SQLite files stay local.

## Setting up access and integrations

Set `STAFF_EMAILS` to the comma-separated list of staff email addresses. Staff sign in with a personal email link or ChatGPT. Students can open their personal links without an account when the Site allows public visitors. Treat personal links as credentials.

- `SHEET_WEBHOOK_URL` receives `{id,kind:"feedback",record}` immediately after a response is stored. Configure the receiving workflow to upsert on `record.id` and write text fields as literal text. Check-in records also carry `studies`, `housing`, `social`, `health` and `money` (`good`, `ok` or `difficult`; empty for messages), and `need` can be `none`, `soon`, `week` or `urgent`. The in-app register updates independently of provider availability.
- `REMINDER_WEBHOOK_URL` receives `{id,kind:"weekly-reminder",attempt,week,language,to,name,subject,message,link}`. Configure the receiving workflow to send the supplied subject, message and personal link to the intended student. Use the event ID to suppress duplicates. `attempt` is `1` for the weekly email and `2` for the follow-up reminder, which has its own subject and message. The same webhook receives `final-feedback` events (`attempt` 1–3 or `manual-…`, `link` to `/final#…`) and `call-booked` / `call-cancelled` events (`cc` = consultant email, `ics` = calendar invite to attach).
- `WEBHOOK_SECRET` is the bearer token sent to both configured HTTPS webhook receivers. Receivers should return success only after durable acceptance, and deduplicate on the supplied `Idempotency-Key`.
- `JOB_SECRET` authorizes a scheduler to POST to `/api/jobs` using `Authorization: Bearer …`. A private Site also requires its platform service access. Jobs send one email per student per Monday–Sunday week and skip students who have already checked in. If a student still has not checked in four calendar days (Madrid time) after that email, the next run sends one follow-up reminder. The follow-up only goes out within the same week, so a first email sent Thursday to Sunday gets no follow-up; the next week's email takes its place. This relies on jobs running daily. They also retry pending spreadsheet deliveries. A daily run catches students who start midweek, and repeated invocations can drain the bounded batches. Review delivery from Settings during setup.

Test with fictional records and a controlled delivery address before inviting students.

## Instant sync to Google Sheets

The Sheets owner can paste `integrations/google-sheets.gs` into **Extensions → Apps Script** from the destination workbook. In the script's **Project Settings → Script properties**, set `SPREADSHEET_ID` to the workbook ID and `SHEET_APPS_SCRIPT_SECRET` to a securely generated random secret of at least 32 bytes. In **Deploy → New deployment → Web app**, execute as the owner, allow **Anyone**, and authorize the script. The workbook keeps its separate sharing settings. The web app accepts only signed, recent requests.

Use the deployment URL ending in `/exec` as the Site runtime variable `SHEET_APPS_SCRIPT_URL`. Set the matching `SHEET_APPS_SCRIPT_SECRET` as a secret in Sites and redeploy. Submit one test check-in and verify it adds a single row in **Responses**. The immediate path inserts new responses. Later support-status edits remain eligible for the scheduled sync.

After updating the script, add headers `Studies`, `Housing`, `Social life`, `Health`, `Money` in M1–Q1 of **Responses**, and create a **Final feedback** sheet whose first row has 25 headers ending with `Response ID` in Y1 (Sent on, Student, Destination, Program end, Overall, Recommend, Where they lived, Housing, Housing comment, School, School comment, Friends, Friends comment, Local support, Local support comment, Team support, Team support comment, Travel, Best part, To improve, Advice, Share consent, Future programs, Language, Response ID).

Staff can sign in with reusable personal email links. Issuance requires the Site's `STAFF_INVITE_SECRET` and an allowlisted recipient. A reusable link works until the recipient's access is removed or the signing secret changes. Each browser session expires after 30 days or upon sign-out. Keep sign-in links private.

Staff can delete and restore student profiles and feedback from the CRM. Deleting a student pauses their check-ins and hides associated feedback until their profile is restored.

## Weekly check-in emails

Use `integrations/check-in-email.html` (English) or `integrations/check-in-email.it.html` (Italian, matching the event's `language`) for reminder email bodies. Substitute the student's HTML-escaped first name and personal HTTPS check-in URL. The **Form** link opens their survey in the browser without a sign-in. The hosted reminder schedule configures sending separately. `integrations/final-feedback-email.html` is the Italian + English body for the final feedback invitation (`{{FINAL_FORM_URL}}` = the event's `link`).
