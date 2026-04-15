import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAnnouncements, createAnnouncement, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const audience = req.nextUrl.searchParams.get("audience") ?? undefined;
    const items = await getAnnouncements(audience);
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/announcements", e);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.postAnnouncements(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(req)) return apiError("Invalid origin", 403);

    const body = await req.json();
    const announcement = await createAnnouncement({
      ...body,
      author_discord_id: session.user.discordId!,
    });

    await appendAuditLog({
      actor_discord_id: session.user.discordId!,
      action_type: "ANNOUNCEMENT_CREATE",
      entity_type: "announcement",
      entity_id: announcement.id,
      before_val: null,
      after_val: announcement as unknown as Record<string, unknown>,
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (e) {
    console.error("POST /api/announcements", e);
    return apiError("Internal server error", 500);
  }
}
