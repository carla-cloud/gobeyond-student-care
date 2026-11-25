-- Consultant call calendar. Slot status: 'open', 'booked' or 'cancelled'.
-- Example slots for the coming working days are created by the app the first time it runs with no slots.
CREATE TABLE IF NOT EXISTS consultants (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS slots (
 id TEXT PRIMARY KEY, consultant_id TEXT NOT NULL REFERENCES consultants(id),
 starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
 student_id TEXT REFERENCES students(id), feedback_id TEXT REFERENCES feedback(id),
 booked_at TEXT, cancelled_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS one_booking_per_checkin ON slots(feedback_id) WHERE status='booked';
INSERT OR IGNORE INTO consultants (id,name,phone) VALUES
 ('maria','Maria','+39 320 123 4567'),
 ('francesco','Francesco','+39 331 234 5678'),
 ('giorgia','Giorgia','+39 342 345 6789');
