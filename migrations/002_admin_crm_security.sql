-- Admin CRM fields and durable lead rate limiting
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_leads_priority_created_at ON leads(priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up_at ON leads(next_follow_up_at);

CREATE TABLE IF NOT EXISTS lead_rate_limits (
  rate_key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_rate_limits_reset_at ON lead_rate_limits(reset_at);
