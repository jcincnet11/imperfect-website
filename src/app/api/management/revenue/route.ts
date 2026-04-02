import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getRevenue, createRevenue } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField, safeNumber } from "@/lib/validate";

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
  if (!verifyCsrfOrigin(request)) return Response.json({ error: "Invalid origin" }, { status: 403 });

  const body = await request.json() as Record<string, unknown>;
  const missing = missingField(body, ["date", "category"]);
  if (missing) return Response.json({ error: `Missing required field: ${missing}` }, { status: 400 });

  const entry = await createRevenue({
    date: body.date as string,
    category: body.category as string,
    description: (body.description as string) ?? null,
    invoice_number: (body.invoice_number as string) ?? null,
    amount: safeNumber(body.amount),
    cost: safeNumber(body.cost),
    payment_method: (body.payment_method as string) ?? null,
    received: Boolean(body.received),
    receipt_ref: (body.receipt_ref as string) ?? null,
    notes: (body.notes as string) ?? null,
  });
  return Response.json(entry, { status: 201 });
}
