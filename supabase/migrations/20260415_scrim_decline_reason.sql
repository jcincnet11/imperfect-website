-- Add optional decline_reason to scrim_applications so managers can
-- provide feedback to external teams when declining their application.
ALTER TABLE scrim_applications
  ADD COLUMN IF NOT EXISTS decline_reason TEXT;
