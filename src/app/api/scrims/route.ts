import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getScrims, createScrim } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { appendAuditLog } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const division = req.nextUrl.searchParams.get("division") ?? undefined;
    const scrims = await getScrims(division);
    return NextResponse.json(scrims);
  } catch (e) {
    console.error("GET /api/scrims", e);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.manageScrim(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(req)) return apiError("Invalid origin", 403);

    const body = await req.json();
    const scrim = await createScrim({
      ...body,
      created_by: session.user.discordId!,
    });

    await appendAuditLog({
      actor_discord_id: session.user.discordId!,
      action_type: "SCRIM_CREATE",
      entity_type: "scrim",
      entity_id: scrim.id,
      before_val: null,
      after_val: scrim as unknown as Record<string, unknown>,
    });

    return NextResponse.json(scrim, { status: 201 });
  } catch (e) {
    console.error("POST /api/scrims", e);
    return apiError("Internal server error", 500);
  }
}
