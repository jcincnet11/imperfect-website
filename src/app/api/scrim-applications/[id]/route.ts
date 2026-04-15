import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { updateScrimApplication, type ScrimApplication } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { appendAuditLog } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

async function notifyScrimDeclined(app: ScrimApplication, reviewerName: string) {
  const channelId = process.env.DISCORD_CHANNEL_SCRIMS;
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!channelId || !token) return;

  const gameLabel = app.game === "ow2" ? "Overwatch 2" : app.game === "marvel_rivals" ? "Marvel Rivals" : "Both";

  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "❌ Scrim Application Declined",
          color: 0xef4444,
          fields: [
            { name: "Team",    value: app.team_name,       inline: true },
            { name: "Game",    value: gameLabel,           inline: true },
            { name: "Captain", value: app.captain_discord, inline: true },
            ...(app.decline_reason
              ? [{ name: "Reason", value: app.decline_reason, inline: false }]
              : []),
            { name: "Reviewed by", value: reviewerName, inline: false },
          ],
          footer: { text: "IMPerfect Team Hub · Scrim Applications" },
        },
      ],
    }),
  });
}

/**
 * PATCH /api/scrim-applications/[id]
 * Manager+ only — update application status, link to scrim, etc.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as Record<string, unknown>;
    const discordId = user.discordId as string;
    const orgRole = resolveOrgRole({ discordId, orgRole: user.orgRole as string });

    if (!can.manageScrim(orgRole)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const patch: Record<string, unknown> = {};
    if (body.status) patch.status = body.status;
    if (body.linked_scrim_id) patch.linked_scrim_id = body.linked_scrim_id;
    if (typeof body.decline_reason === "string") {
      patch.decline_reason = body.decline_reason.trim().slice(0, 500) || null;
    }
    if (body.status === "accepted" || body.status === "declined" || body.status === "scheduled") {
      patch.reviewed_by = discordId;
      patch.reviewed_at = new Date().toISOString();
    }

    const updated = await updateScrimApplication(id, patch);

    await appendAuditLog({
      actor_discord_id: discordId,
      action_type: "SCRIM_APP_UPDATE",
      entity_type: "scrim_application",
      entity_id: id,
      before_val: null,
      after_val: patch as Record<string, unknown>,
    });

    if (body.status === "declined") {
      notifyScrimDeclined(updated, session.user.name ?? discordId).catch((err) => {
        console.error("Discord notify (scrim declined):", err);
      });
    }

    return Response.json({ application: updated });
  } catch (e) {
    console.error("PATCH /api/scrim-applications/[id]", e);
    return apiError("Internal server error", 500);
  }
}
