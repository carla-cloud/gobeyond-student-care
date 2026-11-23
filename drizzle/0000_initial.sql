CREATE TABLE IF NOT EXISTS students (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 destination TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL,
 token TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS feedback (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES students(id), week TEXT NOT NULL,
 kind TEXT NOT NULL, mood INTEGER, need TEXT NOT NULL, topic TEXT NOT NULL, note TEXT NOT NULL,
 priority TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL,
 UNIQUE(student_id, week, kind, id)
);
CREATE UNIQUE INDEX IF NOT EXISTS one_checkin_per_week ON feedback(student_id,week) WHERE kind='check-in';
CREATE TABLE IF NOT EXISTS delivery (
 id TEXT PRIMARY KEY, kind TEXT NOT NULL, state TEXT NOT NULL, updated_at TEXT NOT NULL
);
