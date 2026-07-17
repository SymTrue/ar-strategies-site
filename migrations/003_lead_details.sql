-- Newsletter vs application split: leads now arrive from two funnels
-- (source 'newsletter' or 'application'), and applications carry form
-- details that previously lived only in the notification email.
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS details JSONB;

CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
