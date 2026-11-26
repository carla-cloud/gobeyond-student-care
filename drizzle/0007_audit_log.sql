-- Who did what: staff actions (calls cancelled, times removed, records deleted, ...).
CREATE TABLE IF NOT EXISTS audit_log (
 id TEXT PRIMARY KEY, at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL,
 object_type TEXT NOT NULL, object_id TEXT, details TEXT NOT NULL DEFAULT ''
);
