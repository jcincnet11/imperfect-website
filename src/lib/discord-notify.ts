import type { ScheduleBlock, Player } from "./db";

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
 */
export async function notifyAvailabilityComplete(
  division: string,
  weekLabel: string,
  players: Player[],
  summary: { available: number; unavailable: number; unsure: number },
): Promise<void> {
  const channelId = getChannelId(division);
  if (!channelId) return;

  const total = players.length;
  const names = players.map((p) => p.display_name).join(", ");

  await sendMessage(channelId, {
    embeds: [
      {
        title: "✅ Availability Complete",
        description: `All **${total}** players on **${division}** have submitted their availability for the week of **${weekLabel}**.`,
        color: 0xc8e400,
        fields: [
          { name: "Available", value: `${summary.available} entries`, inline: true },
          { name: "Unavailable", value: `${summary.unavailable} entries`, inline: true },
          { name: "Unsure", value: `${summary.unsure} entries`, inline: true },
          { name: "Players", value: names, inline: false },
        ],
        footer: { text: `IMPerfect Team Hub · ${division}` },
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
