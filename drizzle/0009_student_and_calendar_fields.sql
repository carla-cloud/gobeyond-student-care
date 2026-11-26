ALTER TABLE students ADD COLUMN phone TEXT;
ALTER TABLE students ADD COLUMN parent_email TEXT;
ALTER TABLE students ADD COLUMN language TEXT;
ALTER TABLE students ADD COLUMN anonymized_at TEXT;
ALTER TABLE consultants ADD COLUMN email TEXT;
ALTER TABLE consultants ADD COLUMN active INTEGER NOT NULL DEFAULT 1;
ALTER TABLE slots ADD COLUMN student_phone TEXT;
ALTER TABLE slots ADD COLUMN cancelled_by TEXT;
