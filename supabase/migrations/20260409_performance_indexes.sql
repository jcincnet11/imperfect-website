-- Performance indexes for frequently filtered queries
-- 2026-04-09

-- Players: filtered by division and archived status in nearly every query
CREATE INDEX idx_players_division_active ON players (division) WHERE archived = false;

-- Availability: filtered by week_start + player in the availability grid
CREATE INDEX idx_availability_week_player ON availability (week_start, player_discord_id);

-- Schedule blocks: filtered by week_start + division in reminders cron and schedule grid
CREATE INDEX idx_schedule_blocks_week_div ON schedule_blocks (week_start, division);

-- Scrims: filtered by division and scheduled_at for the scrims panel
CREATE INDEX idx_scrims_division_date ON scrims (division, scheduled_at DESC);

-- Availability templates: looked up by player discord_id
CREATE INDEX idx_avail_templates_player ON availability_templates (player_discord_id);

-- Availability overrides: looked up by player + date
CREATE INDEX idx_avail_overrides_player_date ON availability_overrides (player_discord_id, override_date);
