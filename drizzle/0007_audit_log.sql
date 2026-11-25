-- Who did what: staff actions (calls cancelled, times removed, records deleted, ...).
-- The new columns students.phone/parent_email/language/anonymized_at, consultants.email/active and
-- slots.student_phone/cancelled_by are added by the app itself on first run (worker.mjs, addedColumns),
-- so they work whether or not this migration has run yet.
CREATE TABLE IF NOT EXISTS audit_log (
 id TEXT PRIMARY KEY, at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL,
 object_type TEXT NOT NULL, object_id TEXT, details TEXT NOT NULL DEFAULT ''
);
