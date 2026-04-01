import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isOrgAdmin } from "@/lib/admin";
import { getSponsors, createSponsor } from "@/lib/management-db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const data = await getSponsors();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOrgAdmin(session)) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const sponsor = await createSponsor({
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
  return Response.json(sponsor, { status: 201 });
}
