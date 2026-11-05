-- Every email sent to work@ or hello@mossscott.com lands here.
-- An agent can pick up rows WHERE status = 'new', process them,
-- and set status to 'done' (or 'ignored') with notes.
CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  mailbox TEXT NOT NULL,
  from_address TEXT NOT NULL,
  from_name TEXT,
  reply_to TEXT,
  subject TEXT,
  text_body TEXT,
  html_body TEXT,
  message_id TEXT,
  in_reply_to TEXT,
  references_header TEXT,
  attachments TEXT NOT NULL DEFAULT '[]',
  raw_size INTEGER,
  status TEXT NOT NULL DEFAULT 'new',
  agent_notes TEXT,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS emails_status_received ON emails (status, received_at);
CREATE UNIQUE INDEX IF NOT EXISTS emails_message_id ON emails (message_id) WHERE message_id IS NOT NULL;
