-- Weekly check-in answers to "How are these things going?" (good / ok / difficult per area).
CREATE TABLE IF NOT EXISTS checkin_areas (
 feedback_id TEXT PRIMARY KEY REFERENCES feedback(id),
 studies TEXT NOT NULL, housing TEXT NOT NULL, social TEXT NOT NULL, health TEXT NOT NULL, money TEXT NOT NULL
);
