-- Student details added by staff: passport, visa, host family / residence, school abroad, emergency contacts
-- and other documents. `data` holds the fields of each kind as JSON (see itemKinds in worker.mjs).
-- The app also creates these tables itself on first run, so it works whether or not this migration has run.
CREATE TABLE IF NOT EXISTS student_items (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES students(id), kind TEXT NOT NULL, data TEXT NOT NULL,
 created_at TEXT NOT NULL, created_by TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS student_items_by_student ON student_items(student_id);
-- One optional file per detail (e.g. the passport scan), base64, at most 1 MB.
CREATE TABLE IF NOT EXISTS student_files (
 item_id TEXT PRIMARY KEY REFERENCES student_items(id), name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL,
 content TEXT NOT NULL, uploaded_at TEXT NOT NULL, uploaded_by TEXT NOT NULL
);
