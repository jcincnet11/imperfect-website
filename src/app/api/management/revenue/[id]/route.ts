import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { updateRevenue, deleteRevenue } from "@/lib/management-db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const updated = await updateRevenue(id, {
    date: body.date,
    category: body.category,
    description: body.description ?? null,
    invoice_number: body.invoice_number ?? null,
    amount: Number(body.amount ?? 0),
    cost: Number(body.cost ?? 0),
    payment_method: body.payment_method ?? null,
    received: Boolean(body.received),
    receipt_ref: body.receipt_ref ?? null,
    notes: body.notes ?? null,
  });
  return Response.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await deleteRevenue(id);
  return Response.json({ ok: true });
}
