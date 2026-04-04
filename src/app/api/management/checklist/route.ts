import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getChecklist, updateChecklistItem } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField } from "@/lib/validate";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);

    const data = await getChecklist();
    return Response.json(data);
  } catch (e) {
    console.error("GET /api/management/checklist", e);
    return apiError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const body = await request.json() as Record<string, unknown>;
    const missing = missingField(body, ["id"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);
    if (typeof body.completed !== "boolean") {
      return apiError("Field completed must be a boolean", 400);
    }

    const user = session.user as { displayName?: string; name?: string | null };
    const completedBy = user.displayName ?? user.name ?? "admin";

    const updated = await updateChecklistItem(body.id as string, body.completed, completedBy);
    return Response.json(updated);
  } catch (e) {
    console.error("PUT /api/management/checklist", e);
    return apiError("Internal server error", 500);
  }
}
