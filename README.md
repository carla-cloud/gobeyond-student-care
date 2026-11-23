# Gobeyond Student Care

The shared CRM database powers the overview, feedback register, spreadsheet view, and follow-up queue. Use the Students page to register a student's program dates and copy their personal check-in link. Students can submit one check-in per Madrid calendar week, and can send separate messages throughout their program.

An explicit urgent request is flagged urgent. A low mood rating, a request for support, or a separate message opens a follow-up. Staff can mark follow-ups in progress or resolved. CSV export includes all responses.

## Running locally

Run `npm run dev` with Node.js 24 or later. The local preview uses a SQLite file and simulates a staff session. Use sample data only for testing. `npm run build` packages the hosted Worker. SQLite files stay local.

## Setting up access and integrations

Set `STAFF_EMAILS` to the comma-separated list of staff email addresses. Staff sign in with a personal email link or ChatGPT. Students can open their personal links without an account when the Site allows public visitors. Treat personal links as credentials.

- `SHEET_WEBHOOK_URL` receives `{id,kind:"feedback",record}` immediately after a response is stored. Configure the receiving workflow to upsert on `record.id` and write text fields as literal text. The in-app register updates independently of provider availability.
- `REMINDER_WEBHOOK_URL` receives `{id,kind:"weekly-reminder",week,to,name,subject,message,link}`. Configure the receiving workflow to send the supplied personal link to the intended student. Use the event ID to suppress duplicates.
- `WEBHOOK_SECRET` is the bearer token sent to both configured HTTPS webhook receivers. Receivers should return success only after durable acceptance, and deduplicate on the supplied `Idempotency-Key`.
- `JOB_SECRET` authorizes a scheduler to POST to `/api/jobs` using `Authorization: Bearer …`. A private Site also requires its platform service access. Jobs send one reminder per student per Monday–Sunday week and skip students who have already responded. They also retry pending spreadsheet deliveries. A daily run catches students who start midweek, and repeated invocations can drain the bounded batches. Review delivery from Settings during setup.

Test with fictional records and a controlled delivery address before inviting students.

## Instant sync to Google Sheets

The Sheets owner can paste `integrations/google-sheets.gs` into **Extensions → Apps Script** from the destination workbook. In the script's **Project Settings → Script properties**, set `SPREADSHEET_ID` to the workbook ID and `SHEET_APPS_SCRIPT_SECRET` to a securely generated random secret of at least 32 bytes. In **Deploy → New deployment → Web app**, execute as the owner, allow **Anyone**, and authorize the script. The workbook keeps its separate sharing settings. The web app accepts only signed, recent requests.

Use the deployment URL ending in `/exec` as the Site runtime variable `SHEET_APPS_SCRIPT_URL`. Set the matching `SHEET_APPS_SCRIPT_SECRET` as a secret in Sites and redeploy. Submit one test check-in and verify it adds a single row in **Responses**. The immediate path inserts new responses. Later support-status edits remain eligible for the scheduled sync.

Staff can sign in with reusable personal email links. Issuance requires the Site's `STAFF_INVITE_SECRET` and an allowlisted recipient. A reusable link works until the recipient's access is removed or the signing secret changes. Each browser session expires after 30 days or upon sign-out. Keep sign-in links private.

Staff can delete and restore student profiles and feedback from the CRM. Deleting a student pauses their check-ins and hides associated feedback until their profile is restored.
