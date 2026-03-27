-- IMPerfect Team Hub — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.

-- Players table
CREATE TABLE IF NOT EXISTS players (
  discord_id    TEXT PRIMARY KEY,
  display_name  TEXT NOT NULL,
  division      TEXT NOT NULL CHECK (division IN ('OW2', 'MR')),
  role          TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('admin', 'coach', 'player')),
  is_admin      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule blocks table
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start  DATE NOT NULL,
  division    TEXT NOT NULL CHECK (division IN ('OW2', 'MR')),
  day         TEXT NOT NULL CHECK (day IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')),
  time_slot   TEXT NOT NULL,                  -- e.g. "16:00", "17:00"
  block_type  TEXT NOT NULL CHECK (block_type IN (
                'PRACTICE', 'SCRIM', 'VOD_REVIEW', 'MEETING', 'TOURNAMENT', 'FLEX', 'REST'
              )),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start          DATE NOT NULL,
  player_discord_id   TEXT NOT NULL REFERENCES players(discord_id) ON DELETE CASCADE,
  day                 TEXT NOT NULL CHECK (day IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')),
  status              TEXT NOT NULL DEFAULT 'UNSURE' CHECK (status IN ('AVAILABLE', 'UNAVAILABLE', 'UNSURE')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (week_start, player_discord_id, day)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schedule_blocks_updated_at
  BEFORE UPDATE ON schedule_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (optional but recommended)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by the app via anon key)
CREATE POLICY "Allow all for anon" ON players FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON schedule_blocks FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON availability FOR ALL USING (true);
