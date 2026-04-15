import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getOverrides, upsertOverride, deleteOverride, type AvailabilityBlock } from "@/lib/db";
import { resolveOrgRole, hasRole } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

/**
 * GET /api/availability/override?discord_id=...
 * Returns future overrides for the player.
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

    const overrides = await getOverrides(targetId);
    return Response.json({ overrides });
  } catch (e) {
    console.error("GET /api/availability/override", e);
    return apiError("Internal server error", 500);
  }
}

/**
 * POST /api/availability/override
 * Body: { discord_id?, override_date, morning, afternoon, evening }
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
      override_date: string;
      morning: AvailabilityBlock;
      afternoon: AvailabilityBlock;
      evening: AvailabilityBlock;
    };

    let targetId = discordId;
    if (body.discord_id && body.discord_id !== discordId) {
      if (!hasRole(orgRole, "ORG_ADMIN")) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      targetId = body.discord_id;
    }

    if (!body.override_date) {
      return Response.json({ error: "override_date required" }, { status: 400 });
    }

    // Max 30 future overrides
    const existing = await getOverrides(targetId);
    if (existing.length >= 30 && !existing.some((o) => o.override_date === body.override_date)) {
      return Response.json({ error: "Maximum 30 overrides allowed" }, { status: 400 });
    }

    const saved = await upsertOverride(targetId, {
      override_date: body.override_date,
      morning: body.morning,
      afternoon: body.afternoon,
      evening: body.evening,
    });

    return Response.json({ override: saved });
  } catch (e) {
    console.error("POST /api/availability/override", e);
    return apiError("Internal server error", 500);
  }
}

/**
 * DELETE /api/availability/override?override_date=YYYY-MM-DD&discord_id=...
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

    const user = session.user as Record<string, unknown>;
    const discordId = user.discordId as string;
    const orgRole = resolveOrgRole({ discordId, orgRole: user.orgRole as string });

    const overrideDate = request.nextUrl.searchParams.get("override_date");
    if (!overrideDate) return Response.json({ error: "override_date required" }, { status: 400 });

    let targetId = discordId;
    const paramId = request.nextUrl.searchParams.get("discord_id");
    if (paramId && paramId !== discordId) {
      if (!hasRole(orgRole, "ORG_ADMIN")) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      targetId = paramId;
    }

    await deleteOverride(targetId, overrideDate);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error("DELETE /api/availability/override", e);
    return apiError("Internal server error", 500);
  }
}
