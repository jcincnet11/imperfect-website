-- IMPerfect Team Hub — Community Team Registration
-- Applied: 2026-04-07

-- ─── 1. Community Teams ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS community_teams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name       VARCHAR(50) NOT NULL,
  team_tag        VARCHAR(6),
  games           JSONB NOT NULL DEFAULT '[]'::jsonb,
  platforms       JSONB NOT NULL DEFAULT '[]'::jsonb,
  region          VARCHAR NOT NULL,
  discord_server  VARCHAR,
  referral_source VARCHAR,
  goals           JSONB NOT NULL DEFAULT '[]'::jsonb,
  about           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','declined','active')),
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by     TEXT REFERENCES players(discord_id),
  reviewed_at     TIMESTAMPTZ,
  notes           TEXT
);

ALTER TABLE community_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON community_teams FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE INDEX idx_community_teams_status ON community_teams (status, submitted_at DESC);

-- ─── 2. Community Team Players ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS community_team_players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         UUID NOT NULL REFERENCES community_teams(id) ON DELETE CASCADE,
  is_captain      BOOLEAN NOT NULL DEFAULT false,
  ign             VARCHAR(30) NOT NULL,
  discord_handle  VARCHAR NOT NULL,
  role            VARCHAR NOT NULL,
  rank            VARCHAR NOT NULL,
  platform        VARCHAR NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE community_team_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON community_team_players FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE INDEX idx_community_players_team ON community_team_players (team_id);
-- For duplicate check: captain discord + game within time window
CREATE INDEX idx_community_teams_captain ON community_team_players (discord_handle, is_captain) WHERE is_captain = true;
