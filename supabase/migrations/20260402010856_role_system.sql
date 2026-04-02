-- IMPerfect Team Hub — Role System & Feature Tables
-- Applied: 2026-04-02

-- ─── 1. Fix players table ─────────────────────────────────────────────────────

-- Drop the broken division CHECK (data uses 'IMPerfect','Shadows','Echoes' — not 'OW2','MR')
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_division_check;

-- Add new columns
ALTER TABLE players
  ADD COLUMN IF NOT EXISTS org_role     TEXT NOT NULL DEFAULT 'PLAYER'
                                        CHECK (org_role IN ('ORG_ADMIN','HEAD_COACH','MANAGER','CAPTAIN','PLAYER')),
  ADD COLUMN IF NOT EXISTS game         TEXT CHECK (game IN ('OW2','MR','BOTH')),
  ADD COLUMN IF NOT EXISTS in_game_role TEXT,
  ADD COLUMN IF NOT EXISTS rank         TEXT,
  ADD COLUMN IF NOT EXISTS captain_of   TEXT,
  ADD COLUMN IF NOT EXISTS archived     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Backfill org_role from legacy role column
UPDATE players SET org_role = CASE
  WHEN role = 'admin' THEN 'ORG_ADMIN'
  WHEN role = 'coach' THEN 'HEAD_COACH'
  ELSE 'PLAYER'
END;

-- Seed player metadata
UPDATE players SET game = 'BOTH', in_game_role = 'Strategist' WHERE display_name = 'iaguacate';
UPDATE players SET game = 'BOTH', in_game_role = 'Strategist', org_role = 'CAPTAIN', captain_of = 'IMPerfect' WHERE display_name = 'lblazerowl';
UPDATE players SET game = 'MR', in_game_role = 'Duelist'     WHERE display_name = 'crazyturnx';
UPDATE players SET game = 'MR', in_game_role = 'Strategist'  WHERE display_name = 'georgierican';
UPDATE players SET game = 'MR', in_game_role = 'Vanguard'    WHERE display_name = 'spooit';
UPDATE players SET game = 'MR', in_game_role = 'Duelist'     WHERE display_name = 'the_mofn_ninja';
UPDATE players SET game = 'MR', in_game_role = 'Duelist'     WHERE display_name = 'tides100ping';
UPDATE players SET game = 'MR', in_game_role = 'Vanguard'    WHERE display_name = 'zoivanni';
UPDATE players SET game = 'MR', in_game_role = 'Duelist'     WHERE display_name = 'oxarianz';
UPDATE players SET game = 'MR', in_game_role = 'Duelist'     WHERE display_name = 'vhaze21';
UPDATE players SET game = 'MR', in_game_role = 'Vanguard'    WHERE display_name = 'azul1to';
UPDATE players SET game = 'MR', in_game_role = 'Strategist'  WHERE display_name = 'filthypryde';
UPDATE players SET game = 'MR', in_game_role = 'Duelist'     WHERE display_name = 'shokwave10';
UPDATE players SET game = 'MR', in_game_role = 'Support'     WHERE display_name = 'silenustv';

-- Auto-update updated_at on players
CREATE OR REPLACE FUNCTION update_players_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS players_updated_at ON players;
CREATE TRIGGER players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_players_updated_at();

-- ─── 2. Scrims table ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scrims (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game         TEXT NOT NULL CHECK (game IN ('OW2','MR')),
  division     TEXT NOT NULL,
  opponent_org TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  format       TEXT,
  status       TEXT NOT NULL DEFAULT 'Pending'
               CHECK (status IN ('Pending','Confirmed','Cancelled','Completed')),
  result       TEXT CHECK (result IN ('W','L','Draw')),
  score        TEXT,
  notes        TEXT,
  created_by   TEXT NOT NULL REFERENCES players(discord_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_scrims_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS scrims_updated_at ON scrims;
CREATE TRIGGER scrims_updated_at
  BEFORE UPDATE ON scrims
  FOR EACH ROW EXECUTE FUNCTION update_scrims_updated_at();

-- ─── 3. Announcements table ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  body              TEXT NOT NULL,
  author_discord_id TEXT NOT NULL REFERENCES players(discord_id),
  pinned            BOOLEAN NOT NULL DEFAULT false,
  target_audience   TEXT NOT NULL DEFAULT 'ALL'
                    CHECK (target_audience IN ('ALL','IMPERFECT','SHADOWS','ECHOES',
                                               'COACHES','MANAGERS','PLAYERS')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS announcements_updated_at ON announcements;
CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_announcements_updated_at();

-- ─── 4. Audit log table (append-only) ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_discord_id TEXT NOT NULL,
  action_type      TEXT NOT NULL,
  entity_type      TEXT NOT NULL,
  entity_id        TEXT NOT NULL,
  before_val       JSONB,
  after_val        JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 5. Invites table ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token       TEXT NOT NULL UNIQUE DEFAULT encode(extensions.gen_random_bytes(24), 'hex'),
  org_role    TEXT NOT NULL CHECK (org_role IN ('ORG_ADMIN','HEAD_COACH','MANAGER','CAPTAIN','PLAYER')),
  created_by  TEXT NOT NULL,
  used_by     TEXT,
  used_at     TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 6. RLS policies for new tables ─────────────────────────────────────────

ALTER TABLE scrims       ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON scrims        FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON announcements  FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON audit_log      FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON invites        FOR ALL USING (true);
