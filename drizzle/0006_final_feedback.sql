-- End-of-journey final feedback: one response per student (questions 1-14 of the final form).
CREATE TABLE IF NOT EXISTS final_feedback (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL UNIQUE REFERENCES students(id),
 overall INTEGER NOT NULL, recommend INTEGER NOT NULL, housing_type TEXT NOT NULL,
 housing INTEGER NOT NULL, housing_comment TEXT NOT NULL DEFAULT '',
 school INTEGER NOT NULL, school_comment TEXT NOT NULL DEFAULT '',
 social INTEGER NOT NULL, social_comment TEXT NOT NULL DEFAULT '',
 local_support INTEGER NOT NULL, local_support_comment TEXT NOT NULL DEFAULT '',
 team_support INTEGER NOT NULL, team_support_comment TEXT NOT NULL DEFAULT '',
 travel INTEGER, best TEXT NOT NULL DEFAULT '', improve TEXT NOT NULL DEFAULT '', advice TEXT NOT NULL DEFAULT '',
 share_consent INTEGER NOT NULL DEFAULT 0, future_contact INTEGER, language TEXT NOT NULL DEFAULT 'en',
 followup_id TEXT, submitted_at TEXT NOT NULL, deleted_at TEXT
);
