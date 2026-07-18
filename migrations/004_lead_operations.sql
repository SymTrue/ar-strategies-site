-- Formal operational data model for reliable lead capture and follow-up.
-- Apply after migrations 001–003.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS landing_path TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS utm JSONB,
  ADD COLUMN IF NOT EXISTS newsletter_unsubscribed_at TIMESTAMP;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'confirmed', 'notification_failed', 'contacted', 'qualified', 'won', 'lost', 'archived'));

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_priority_check;
ALTER TABLE leads ADD CONSTRAINT leads_priority_check
  CHECK (priority IN ('low', 'normal', 'high'));

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads ADD CONSTRAINT leads_source_check
  CHECK (source IN ('homepage', 'newsletter', 'application', 'three-second-test'));

CREATE INDEX IF NOT EXISTS idx_leads_follow_up
  ON leads(next_follow_up_at)
  WHERE next_follow_up_at IS NOT NULL AND status NOT IN ('won', 'lost', 'archived');

CREATE INDEX IF NOT EXISTS idx_leads_email_search ON leads(LOWER(email));

CREATE TABLE IF NOT EXISTS lead_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead_created
  ON lead_events(lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS email_deliveries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  delivery_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  reply_to TEXT,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMP NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMP,
  sent_at TIMESTAMP,
  last_error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT email_deliveries_status_check CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  CONSTRAINT email_deliveries_type_check CHECK (delivery_type IN ('owner_notification', 'lead_confirmation'))
);

CREATE INDEX IF NOT EXISTS idx_email_deliveries_pending
  ON email_deliveries(status, next_attempt_at)
  WHERE status IN ('pending', 'processing');
