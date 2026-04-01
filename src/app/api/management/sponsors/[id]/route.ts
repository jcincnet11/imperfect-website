import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { updateSponsor, deleteSponsor } from "@/lib/management-db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const updated = await updateSponsor(id, {
    company_name: body.company_name,
    industry: body.industry ?? null,
    contact_name: body.contact_name ?? null,
    title: body.title ?? null,
    email: body.email ?? null,
    phone: body.phone ?? null,
    tier: body.tier ?? "Prospect",
    deal_value: Number(body.deal_value ?? 0),
    contract_start: body.contract_start ?? null,
    contract_end: body.contract_end ?? null,
    deliverables: body.deliverables ?? null,
    paid_to_date: Number(body.paid_to_date ?? 0),
    status: body.status ?? "Prospect",
    last_contact: body.last_contact ?? null,
    next_followup: body.next_followup ?? null,
    source: body.source ?? null,
    notes: body.notes ?? null,
  });
  return Response.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await deleteSponsor(id);
  return Response.json({ ok: true });
}
