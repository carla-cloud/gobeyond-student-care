CREATE TABLE IF NOT EXISTS survey_email_schedule (
 id INTEGER PRIMARY KEY CHECK (id=1),
 weekly_day TEXT NOT NULL CHECK (weekly_day IN ('any','mon','tue','wed','thu','fri','sat','sun')),
 weekly_hour INTEGER NOT NULL CHECK (weekly_hour BETWEEN 0 AND 23),
 final_day TEXT NOT NULL CHECK (final_day IN ('end','mon','tue','wed','thu','fri','sat','sun')),
 final_hour INTEGER NOT NULL CHECK (final_hour BETWEEN 0 AND 23)
);
INSERT OR IGNORE INTO survey_email_schedule (id,weekly_day,weekly_hour,final_day,final_hour)
VALUES (1,'any',9,'end',9);
