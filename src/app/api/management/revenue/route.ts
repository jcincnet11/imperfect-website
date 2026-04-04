import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getRevenue, createRevenue } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField, safeNumber } from "@/lib/validate";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);

    const data = await getRevenue();
    return Response.json(data);
  } catch (e) {
    console.error("GET /api/management/revenue", e);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const body = await request.json() as Record<string, unknown>;
    const missing = missingField(body, ["date", "category"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);

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
  } catch (e) {
    console.error("POST /api/management/revenue", e);
    return apiError("Internal server error", 500);
  }
}
