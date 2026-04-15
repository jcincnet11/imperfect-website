import type { ScheduleBlock, Player, Announcement, Lineup, Scrim } from "./db";

const BLOCK_LABELS: Record<string, string> = {
  PRACTICE: "Practice",
  SCRIM: "Scrim",
  VOD_REVIEW: "VOD Review",
  MEETING: "Team Meeting",
  TOURNAMENT: "Tournament",
  FLEX: "Flex",
  REST: "Rest / Off",
};

const BLOCK_COLORS: Record<string, number> = {
  PRACTICE:   0xc5d400,
  SCRIM:      0x3a7bd5,
  VOD_REVIEW: 0x9b59b6,
  MEETING:    0xe67e22,
  TOURNAMENT: 0xe74c3c,
  FLEX:       0x27ae60,
  REST:       0x7f8c8d,
};

const DAY_LABELS: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
  THU: "Thursday", FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};

const TIME_LABELS: Record<string, string> = {
  "16:00": "4:00 PM", "17:00": "5:00 PM", "18:00": "6:00 PM",
  "19:00": "7:00 PM", "20:00": "8:00 PM", "21:00": "9:00 PM",
};

function getChannelId(team: string): string | null {
  const map: Record<string, string | undefined> = {
    IMPerfect: process.env.DISCORD_CHANNEL_IMPERFECT,
    Shadows:   process.env.DISCORD_CHANNEL_SHADOWS,
    Echoes:    process.env.DISCORD_CHANNEL_ECHOES,
  };
  return map[team] ?? null;
}

async function sendMessage(channelId: string, payload: object): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

function blockEmbed(block: ScheduleBlock, title: string, description?: string) {
  const timeLabel = TIME_LABELS[block.time_slot] ?? block.time_slot;
  const dayLabel = DAY_LABELS[block.day] ?? block.day;
  const typeLabel = BLOCK_LABELS[block.block_type] ?? block.block_type;
  const color = BLOCK_COLORS[block.block_type] ?? 0x7f8c8d;

  return {
    embeds: [
      {
        title,
        description: description ?? null,
        color,
        fields: [
          { name: "Type",    value: typeLabel,  inline: true },
          { name: "Day",     value: dayLabel,   inline: true },
          { name: "Time",    value: timeLabel,  inline: true },
          ...(block.notes ? [{ name: "Notes", value: block.notes, inline: false }] : []),
        ],
        footer: { text: `IMPerfect Team Hub · ${block.division}` },
      },
    ],
  };
}

export async function notifyBlockAdded(block: ScheduleBlock): Promise<void> {
  const channelId = getChannelId(block.division);
  if (!channelId) return;
  await sendMessage(channelId, blockEmbed(block, "📅 Session Scheduled"));
}

export async function notifyBlockUpdated(block: ScheduleBlock): Promise<void> {
  const channelId = getChannelId(block.division);
  if (!channelId) return;
  await sendMessage(channelId, blockEmbed(block, "✏️ Session Updated"));
}

export async function notifyBlockDeleted(block: ScheduleBlock): Promise<void> {
  const channelId = getChannelId(block.division);
  if (!channelId) return;
  const typeLabel = BLOCK_LABELS[block.block_type] ?? block.block_type;
  const dayLabel = DAY_LABELS[block.day] ?? block.day;
  const timeLabel = TIME_LABELS[block.time_slot] ?? block.time_slot;
  await sendMessage(channelId, {
    embeds: [
      {
        title: "🗑️ Session Removed",
        description: `**${typeLabel}** on ${dayLabel} at ${timeLabel} has been removed.`,
        color: 0x555555,
        footer: { text: `IMPerfect Team Hub · ${block.division}` },
      },
    ],
  });
}

/**
 * Notify when all players on a team have submitted availability for the week.
 * Shows per-day breakdown and highlights best days.
 */
export async function notifyAvailabilityComplete(
  division: string,
  weekLabel: string,
  players: Player[],
  dayBreakdown: { day: string; available: number; total: number }[],
): Promise<void> {
  const channelId = getChannelId(division);
  if (!channelId) return;

  const total = players.length;

  // Determine game(s) from player data
  const games = new Set(players.map((p) => p.game).filter(Boolean));
  const gameLabel = games.size === 0 ? "" :
    [...games].map((g) => g === "OW2" ? "Overwatch 2" : g === "MR" ? "Marvel Rivals" : g === "BOTH" ? "OW2 + MR" : g).join(", ");

  // Build day-by-day summary
  const dayLines = dayBreakdown.map((d) => {
    const pct = Math.round((d.available / d.total) * 100);
    const bar = d.available === d.total ? "🟢" : d.available >= d.total * 0.7 ? "🟡" : "🔴";
    return `${bar} **${d.day}** — ${d.available}/${d.total} available (${pct}%)`;
  });

  // Find best days (everyone or most available)
  const bestDays = dayBreakdown
    .filter((d) => d.available === d.total)
    .map((d) => d.day);
  const goodDays = dayBreakdown
    .filter((d) => d.available >= d.total * 0.7 && d.available < d.total)
    .map((d) => d.day);

  let bestLine = "";
  if (bestDays.length > 0) {
    bestLine = `✅ **Full team available:** ${bestDays.join(", ")}`;
  } else if (goodDays.length > 0) {
    bestLine = `🟡 **Best days (70%+):** ${goodDays.join(", ")}`;
  } else {
    bestLine = "⚠️ No day has 70%+ availability this week";
  }

  await sendMessage(channelId, {
    embeds: [
      {
        title: "📋 Weekly Availability — All Submitted",
        description: `All **${total}** players on **${division}**${gameLabel ? ` (${gameLabel})` : ""} have submitted for **${weekLabel}**.`,
        color: 0xc8e400,
        fields: [
          { name: "Day-by-Day", value: dayLines.join("\n"), inline: false },
          { name: "Best Days to Schedule", value: bestLine, inline: false },
        ],
        footer: { text: `IMPerfect Team Hub · ${division}` },
      },
    ],
  });
}

const AUDIENCE_TO_DIVISIONS: Record<Announcement["target_audience"], string[]> = {
  ALL:       ["IMPerfect", "Shadows", "Echoes"],
  IMPERFECT: ["IMPerfect"],
  SHADOWS:   ["Shadows"],
  ECHOES:    ["Echoes"],
  COACHES:   ["IMPerfect"],
  MANAGERS:  ["IMPerfect"],
  PLAYERS:   ["IMPerfect", "Shadows", "Echoes"],
};

export async function notifyAnnouncement(
  announcement: Announcement,
  authorName: string,
): Promise<void> {
  const divisions = AUDIENCE_TO_DIVISIONS[announcement.target_audience] ?? ["IMPerfect"];
  const audienceLabel = announcement.target_audience === "ALL"
    ? "Everyone"
    : announcement.target_audience.charAt(0) + announcement.target_audience.slice(1).toLowerCase();

  const body = announcement.body.length > 1800
    ? announcement.body.slice(0, 1800) + "…"
    : announcement.body;

  const embed = {
    title: `${announcement.pinned ? "📌 " : "📣 "}${announcement.title}`,
    description: body,
    color: announcement.pinned ? 0xc8e400 : 0x3a7bd5,
    fields: [
      { name: "Audience", value: audienceLabel, inline: true },
      { name: "Posted by", value: authorName, inline: true },
    ],
    footer: { text: "IMPerfect Team Hub · Announcement" },
    timestamp: announcement.created_at,
  };

  await Promise.all(
    divisions.map(async (division) => {
      const channelId = getChannelId(division);
      if (!channelId) return;
      await sendMessage(channelId, { embeds: [embed] });
    }),
  );
}

export async function notifyLineupSubmitted(
  lineup: Lineup,
  scrim: Scrim,
  submitterName: string,
): Promise<void> {
  const channelId = getChannelId(scrim.division);
  if (!channelId) return;

  const gameLabel = scrim.game === "OW2" ? "Overwatch 2" : "Marvel Rivals";
  const scrimDate = new Date(scrim.scheduled_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    timeZone: "America/Puerto_Rico",
  });
  const scrimTime = new Date(scrim.scheduled_at).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Puerto_Rico",
  });

  const ROLE_LABELS: Record<string, string> = {
    tank: "Tank", dps: "DPS", support: "Support",
    vanguard: "Vanguard", duelist: "Duelist", strategist: "Strategist", flex: "Flex",
  };

  const slotLines = lineup.slots
    .map((s) => `**${ROLE_LABELS[s.role] ?? s.role}** — <@${s.player_discord_id}>`)
    .join("\n");

  await sendMessage(channelId, {
    embeds: [
      {
        title: "📋 Lineup Submitted",
        description: `Lineup set for **${scrim.opponent_org}** — ${gameLabel} · ${scrimDate} at ${scrimTime}`,
        color: 0xc8e400,
        fields: [
          { name: "Starters", value: slotLines, inline: false },
          ...(lineup.notes ? [{ name: "Notes", value: lineup.notes, inline: false }] : []),
          { name: "Submitted by", value: submitterName, inline: true },
        ],
        footer: { text: `IMPerfect Team Hub · ${scrim.division}` },
      },
    ],
  });
}

export async function notifyReminder(block: ScheduleBlock, minutesUntil: number): Promise<void> {
  const channelId = getChannelId(block.division);
  if (!channelId) return;
  const label = minutesUntil <= 15 ? "15 minutes" : "1 hour";
  await sendMessage(
    channelId,
    blockEmbed(
      block,
      `⏰ ${label} until ${BLOCK_LABELS[block.block_type] ?? block.block_type}`,
      `Session starts in **${label}**. Get ready!`
    )
  );
}
