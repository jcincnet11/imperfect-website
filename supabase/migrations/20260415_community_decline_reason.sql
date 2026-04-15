-- Add optional decline_reason to community_teams so admins can give
-- declined teams actionable feedback (separate from admin-only notes).
-- Posted in the community Discord channel on decline so captains can
-- see why and reapply.
ALTER TABLE community_teams
  ADD COLUMN IF NOT EXISTS decline_reason TEXT;
