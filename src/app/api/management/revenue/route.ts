import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getRevenue, createRevenue } from "@/lib/management-db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const data = await getRevenue();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const entry = await createRevenue({
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
  return Response.json(entry, { status: 201 });
}
