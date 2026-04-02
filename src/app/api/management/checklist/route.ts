import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getChecklist, updateChecklistItem } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField } from "@/lib/validate";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const data = await getChecklist();
  return Response.json(data);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

  const body = await request.json() as Record<string, unknown>;
  const missing = missingField(body, ["id"]);
  if (missing) return Response.json({ error: `Missing required field: ${missing}` }, { status: 400 });
  if (typeof body.completed !== "boolean") {
    return Response.json({ error: "Field completed must be a boolean" }, { status: 400 });
  }

  const user = session.user as { displayName?: string; name?: string | null };
  const completedBy = user.displayName ?? user.name ?? "admin";

  const updated = await updateChecklistItem(body.id as string, body.completed, completedBy);
  return Response.json(updated);
}
