import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getTemplates, saveTemplates, type AvailabilityBlock } from "@/lib/db";
import { resolveOrgRole, hasRole } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

/**
 * GET /api/availability/template?discord_id=...
 * - Players/Captains: own template only (discord_id ignored)
 * - OWNER/ORG_ADMIN: can fetch any player's template via discord_id param
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as Record<string, unknown>;
    const discordId = user.discordId as string;
    const orgRole = resolveOrgRole({ discordId, orgRole: user.orgRole as string });

    let targetId = discordId;
    const paramId = request.nextUrl.searchParams.get("discord_id");
    if (paramId && paramId !== discordId) {
      if (!hasRole(orgRole, "ORG_ADMIN")) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      targetId = paramId;
    }

    const templates = await getTemplates(targetId);
    return Response.json({ templates });
  } catch (e) {
    console.error("GET /api/availability/template", e);
    return apiError("Internal server error", 500);
  }
}

/**
 * POST /api/availability/template
 * Body: { discord_id?, rows: [{ day_of_week, morning, afternoon, evening }] }
 * - Players/Captains: can only save own template
 * - OWNER/ORG_ADMIN: can save on behalf of any player
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const user = session.user as Record<string, unknown>;
    const discordId = user.discordId as string;
    const orgRole = resolveOrgRole({ discordId, orgRole: user.orgRole as string });

    const body = await request.json() as {
      discord_id?: string;
      rows: { day_of_week: number; morning: AvailabilityBlock; afternoon: AvailabilityBlock; evening: AvailabilityBlock }[];
    };

    let targetId = discordId;
    if (body.discord_id && body.discord_id !== discordId) {
      if (!hasRole(orgRole, "ORG_ADMIN")) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      targetId = body.discord_id;
    }

    if (!Array.isArray(body.rows) || body.rows.length === 0) {
      return Response.json({ error: "rows required" }, { status: 400 });
    }

    await saveTemplates(targetId, body.rows);
    const updated = await getTemplates(targetId);
    return Response.json({ templates: updated });
  } catch (e) {
    console.error("POST /api/availability/template", e);
    return apiError("Internal server error", 500);
  }
}
