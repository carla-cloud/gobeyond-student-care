ALTER TABLE students ADD COLUMN deleted_at TEXT;
ALTER TABLE feedback ADD COLUMN deleted_at TEXT;
DROP INDEX one_checkin_per_week;
CREATE UNIQUE INDEX one_checkin_per_week ON feedback(student_id,week)
 WHERE kind='check-in' AND deleted_at IS NULL;
