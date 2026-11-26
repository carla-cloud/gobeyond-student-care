-- Consultant call calendar. Slot status: 'open', 'booked' or 'cancelled'.
-- Staff add confirmed availability in the Calendar.
CREATE TABLE IF NOT EXISTS consultants (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS slots (
 id TEXT PRIMARY KEY, consultant_id TEXT NOT NULL REFERENCES consultants(id),
 starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
 student_id TEXT REFERENCES students(id), feedback_id TEXT REFERENCES feedback(id),
 booked_at TEXT, cancelled_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS one_booking_per_checkin ON slots(feedback_id) WHERE status='booked';
INSERT OR IGNORE INTO consultants (id,name,phone) VALUES
 ('maria','Maria',''),
 ('francesco','Francesco',''),
 ('giorgia','Giorgia','');
