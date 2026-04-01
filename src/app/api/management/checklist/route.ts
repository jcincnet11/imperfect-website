import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getChecklist, updateChecklistItem } from "@/lib/management-db";

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

  const body = await request.json() as { id: string; completed: boolean };
  const user = session.user as { displayName?: string; name?: string | null };
  const completedBy = user.displayName ?? user.name ?? "admin";

  const updated = await updateChecklistItem(body.id, body.completed, completedBy);
  return Response.json(updated);
}
