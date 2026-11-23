CREATE TABLE staff_access (
 invite_digest TEXT PRIMARY KEY,
 session_digest TEXT UNIQUE,
 email TEXT NOT NULL,
 expires_at TEXT NOT NULL
);
