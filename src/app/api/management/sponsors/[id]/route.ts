import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { updateSponsor, deleteSponsor } from "@/lib/management-db";
import { verifyCsrfOrigin } from "@/lib/csrf";
import { missingField, safeNumber } from "@/lib/validate";
import { apiError } from "@/lib/api-error";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;
    const missing = missingField(body, ["company_name"]);
    if (missing) return apiError(`Missing required field: ${missing}`, 400);

    const updated = await updateSponsor(id, {
      company_name: body.company_name as string,
      industry: (body.industry as string) ?? null,
      contact_name: (body.contact_name as string) ?? null,
      title: (body.title as string) ?? null,
      email: (body.email as string) ?? null,
      phone: (body.phone as string) ?? null,
      tier: (body.tier as string) ?? "Prospect",
      deal_value: safeNumber(body.deal_value),
      contract_start: (body.contract_start as string) ?? null,
      contract_end: (body.contract_end as string) ?? null,
      deliverables: (body.deliverables as string) ?? null,
      paid_to_date: safeNumber(body.paid_to_date),
      status: (body.status as string) ?? "Prospect",
      last_contact: (body.last_contact as string) ?? null,
      next_followup: (body.next_followup as string) ?? null,
      source: (body.source as string) ?? null,
      notes: (body.notes as string) ?? null,
    });
    if (!updated) return apiError("Sponsor not found", 404);
    return Response.json(updated);
  } catch (e) {
    console.error("PUT /api/management/sponsors/[id]", e);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if (!isOrgAdmin(session)) return apiError("Forbidden", 403);
    if (!verifyCsrfOrigin(request)) return apiError("Invalid origin", 403);

    const { id } = await params;
    await deleteSponsor(id);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/management/sponsors/[id]", e);
    return apiError("Internal server error", 500);
  }
}
