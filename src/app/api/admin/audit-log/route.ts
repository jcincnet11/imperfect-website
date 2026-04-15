import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuditLog } from "@/lib/db";
import { resolveOrgRole, can } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = resolveOrgRole(session.user);
    if (!can.viewAuditLog(role)) {
      return NextResponse.json({ error: "Owner access required" }, { status: 403 });
    }

    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "100", 10);
    const log = await getAuditLog(limit);
    return NextResponse.json(log);
  } catch (e) {
    console.error("GET /api/admin/audit-log", e);
    return apiError("Internal server error", 500);
  }
}
