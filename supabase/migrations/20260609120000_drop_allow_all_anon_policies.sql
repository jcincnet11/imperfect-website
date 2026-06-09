-- Drop the allow-all anon policies on every table.
-- RLS stays enabled, so anon now denies by default.
-- The server uses the service role key, which bypasses RLS.

DROP POLICY IF EXISTS "Allow all for anon" ON announcements;
DROP POLICY IF EXISTS "Allow all for anon" ON audit_log;
DROP POLICY IF EXISTS "Allow all for anon" ON availability;
DROP POLICY IF EXISTS "Allow all for anon" ON availability_overrides;
DROP POLICY IF EXISTS "Allow all for anon" ON availability_templates;
DROP POLICY IF EXISTS "Allow all for anon" ON checklist_items;
DROP POLICY IF EXISTS "Allow all for anon" ON community_team_players;
DROP POLICY IF EXISTS "Allow all for anon" ON community_teams;
DROP POLICY IF EXISTS "Allow all for anon" ON invites;
DROP POLICY IF EXISTS "Allow all for anon" ON players;
DROP POLICY IF EXISTS "Allow all for anon" ON revenue;
DROP POLICY IF EXISTS "Allow all for anon" ON schedule_blocks;
DROP POLICY IF EXISTS "Allow all for anon" ON scrim_applications;
DROP POLICY IF EXISTS "Allow all for anon" ON scrims;
DROP POLICY IF EXISTS "Allow all for anon" ON sponsors;
DROP POLICY IF EXISTS "Allow all for anon" ON tournaments;
