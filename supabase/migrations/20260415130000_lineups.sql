-- Lineups for scrims. A lineup locks in who's starting + their role.
-- Slots stored as JSONB for simplicity: [{ "player_discord_id": "...", "role": "tank" }]
-- Game-aware slot count (5 for OW2, 6 for MR) enforced at application level.

CREATE TABLE IF NOT EXISTS lineups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scrim_id        UUID NOT NULL REFERENCES scrims(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'approved')),
  slots           JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes           TEXT,
  submitted_by    TEXT NOT NULL,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by     TEXT,
  approved_at     TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One lineup per scrim (replace-on-update flow)
CREATE UNIQUE INDEX IF NOT EXISTS lineups_scrim_id_idx ON lineups(scrim_id);
