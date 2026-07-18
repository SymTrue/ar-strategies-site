-- Guard against clock/update-path bugs writing an updated_at earlier than
-- created_at. Apply after migrations 001-004.

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_updated_after_created_check;
ALTER TABLE leads ADD CONSTRAINT leads_updated_after_created_check
  CHECK (updated_at >= created_at);

ALTER TABLE email_deliveries DROP CONSTRAINT IF EXISTS email_deliveries_updated_after_created_check;
ALTER TABLE email_deliveries ADD CONSTRAINT email_deliveries_updated_after_created_check
  CHECK (updated_at >= created_at);
