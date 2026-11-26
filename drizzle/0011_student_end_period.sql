ALTER TABLE students ADD COLUMN end_period TEXT NOT NULL DEFAULT 'custom'
 CHECK (end_period IN ('custom','december-first-week','may-last-week'));
