-- IMPerfect Team Hub — Recurring Availability & Scrim Applications
-- Applied: 2026-04-06

-- ─── 1. Availability Templates (recurring weekly schedule) ──────────────────

CREATE TABLE IF NOT EXISTS availability_templates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_discord_id TEXT NOT NULL REFERENCES players(discord_id) ON DELETE CASCADE,
  day_of_week       SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Mon, 6=Sun
  morning           TEXT NOT NULL DEFAULT 'unset'
                    CHECK (morning IN ('available','unavailable','unset')),
  afternoon         TEXT NOT NULL DEFAULT 'unset'
                    CHECK (afternoon IN ('available','unavailable','unset')),
  evening           TEXT NOT NULL DEFAULT 'unset'
                    CHECK (evening IN ('available','unavailable','unset')),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (player_discord_id, day_of_week)
);

CREATE TRIGGER availability_templates_updated_at
  BEFORE UPDATE ON availability_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE availability_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON availability_templates FOR ALL TO anon USING (true) WITH CHECK (true);

-- ─── 2. Availability Overrides (date-specific exceptions) ───────────────────

CREATE TABLE IF NOT EXISTS availability_overrides (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_discord_id TEXT NOT NULL REFERENCES players(discord_id) ON DELETE CASCADE,
  override_date     DATE NOT NULL,
  morning           TEXT NOT NULL DEFAULT 'unset'
                    CHECK (morning IN ('available','unavailable','unset')),
  afternoon         TEXT NOT NULL DEFAULT 'unset'
                    CHECK (afternoon IN ('available','unavailable','unset')),
  evening           TEXT NOT NULL DEFAULT 'unset'
                    CHECK (evening IN ('available','unavailable','unset')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (player_discord_id, override_date)
);

ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON availability_overrides FOR ALL TO anon USING (true) WITH CHECK (true);

-- ─── 3. Scrim Applications (public form submissions) ────────────────────────

CREATE TABLE IF NOT EXISTS scrim_applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name         TEXT NOT NULL,
  discord_invite    TEXT,
  captain_name      TEXT NOT NULL,
  captain_discord   TEXT NOT NULL,
  region            TEXT NOT NULL,
  game              TEXT NOT NULL CHECK (game IN ('ow2','marvel_rivals','both')),
  format            TEXT NOT NULL,
  rank_range        TEXT NOT NULL,
  preferred_days    JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferred_blocks  JSONB NOT NULL DEFAULT '[]'::jsonb,
  earliest_date     DATE NOT NULL,
  message           TEXT,
  discord_confirmed BOOLEAN NOT NULL DEFAULT false,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','accepted','declined','scheduled')),
  linked_scrim_id   UUID REFERENCES scrims(id) ON DELETE SET NULL,
  reviewed_by       TEXT REFERENCES players(discord_id),
  reviewed_at       TIMESTAMPTZ,
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE scrim_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON scrim_applications FOR ALL TO anon USING (true) WITH CHECK (true);

-- Index for duplicate check: captain_discord + game + recent submissions
CREATE INDEX idx_scrim_apps_captain_game ON scrim_applications (captain_discord, game, submitted_at);
-- Index for manager queries
CREATE INDEX idx_scrim_apps_status ON scrim_applications (status, submitted_at DESC);
