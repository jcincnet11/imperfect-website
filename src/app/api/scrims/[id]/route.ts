import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateScrim, deleteScrim, getScrims, appendAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.manageScrim(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(req)) return apiError("Invalid origin", 403);

    const { id } = await params;
    const patch = await req.json();

    // Fetch before for audit
    const before = (await getScrims()).find((s) => s.id === id) ?? null;
    const updated = await updateScrim(id, patch);

    await appendAuditLog({
      actor_discord_id: session.user.discordId!,
      action_type: "SCRIM_UPDATE",
      entity_type: "scrim",
      entity_id: id,
      before_val: before as unknown as Record<string, unknown>,
      after_val: updated as unknown as Record<string, unknown>,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/scrims/[id]", e);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.manageScrim(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(req)) return apiError("Invalid origin", 403);

    const { id } = await params;
    const before = (await getScrims()).find((s) => s.id === id) ?? null;
    await deleteScrim(id);

    await appendAuditLog({
      actor_discord_id: session.user.discordId!,
      action_type: "SCRIM_DELETE",
      entity_type: "scrim",
      entity_id: id,
      before_val: before as unknown as Record<string, unknown>,
      after_val: null,
    });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("DELETE /api/scrims/[id]", e);
    return apiError("Internal server error", 500);
  }
}
