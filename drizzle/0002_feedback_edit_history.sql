CREATE TABLE feedback_edits (
 id TEXT PRIMARY KEY,
 feedback_id TEXT NOT NULL REFERENCES feedback(id),
 edited_at TEXT NOT NULL,
 edited_by TEXT NOT NULL,
 previous_mood INTEGER,
 previous_need TEXT NOT NULL,
 previous_topic TEXT NOT NULL,
 previous_note TEXT NOT NULL,
 previous_priority TEXT NOT NULL,
 previous_status TEXT NOT NULL
);
CREATE INDEX feedback_edits_by_response ON feedback_edits(feedback_id, edited_at);
