/**
 * Data access layer for management-only tables:
 * tournaments, sponsors, revenue, checklist_items
 */
import { supabase } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Tournament = {
  id: string;
  name: string;
  game: string;
  organizer?: string;
  format?: string;
  date_start?: string;
  date_end?: string;
  reg_deadline?: string;
  entry_fee: number;
  prize_pool: number;
  placement?: string;
  prize_won: number;
  wins: number;
  losses: number;
  status: string;
  notes?: string;
  created_at?: string;
};

export type Sponsor = {
  id: string;
  company_name: string;
  industry?: string;
  contact_name?: string;
  title?: string;
  email?: string;
  phone?: string;
  tier: string;
  deal_value: number;
  contract_start?: string;
  contract_end?: string;
  deliverables?: string;
  paid_to_date: number;
  status: string;
  last_contact?: string;
  next_followup?: string;
  source?: string;
  notes?: string;
  created_at?: string;
};

export type Revenue = {
  id: string;
  date: string;
  category: string;
  description?: string;
  invoice_number?: string;
  amount: number;
  cost: number;
  payment_method?: string;
  received: boolean;
  receipt_ref?: string;
  notes?: string;
  created_at?: string;
};

export type ChecklistItem = {
  id: string;
  section: string;
  label: string;
  completed: boolean;
  completed_by?: string;
  completed_at?: string;
  updated_at?: string;
};

// ─── Tournaments ──────────────────────────────────────────────────────────────

export async function getTournaments(): Promise<Tournament[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .order("date_start", { ascending: false });
  return (data as Tournament[]) ?? [];
}

export async function createTournament(t: Omit<Tournament, "id" | "created_at">): Promise<Tournament> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("tournaments").insert(t).select().single();
  if (error) throw error;
  return data as Tournament;
}

export async function updateTournament(id: string, t: Partial<Tournament>): Promise<Tournament> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("tournaments")
    .update(t)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Tournament;
}

export async function deleteTournament(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("tournaments").delete().eq("id", id);
  if (error) throw error;
}

// ─── Sponsors ─────────────────────────────────────────────────────────────────

export async function getSponsors(): Promise<Sponsor[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("sponsors")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Sponsor[]) ?? [];
}

export async function createSponsor(s: Omit<Sponsor, "id" | "created_at">): Promise<Sponsor> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("sponsors").insert(s).select().single();
  if (error) throw error;
  return data as Sponsor;
}

export async function updateSponsor(id: string, s: Partial<Sponsor>): Promise<Sponsor> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("sponsors")
    .update(s)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Sponsor;
}

export async function deleteSponsor(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("sponsors").delete().eq("id", id);
  if (error) throw error;
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

export async function getRevenue(): Promise<Revenue[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("revenue")
    .select("*")
    .order("date", { ascending: false });
  return (data as Revenue[]) ?? [];
}

export async function createRevenue(r: Omit<Revenue, "id" | "created_at">): Promise<Revenue> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("revenue").insert(r).select().single();
  if (error) throw error;
  return data as Revenue;
}

export async function updateRevenue(id: string, r: Partial<Revenue>): Promise<Revenue> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("revenue")
    .update(r)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Revenue;
}

export async function deleteRevenue(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("revenue").delete().eq("id", id);
  if (error) throw error;
}

// ─── Checklist ────────────────────────────────────────────────────────────────

export async function getChecklist(): Promise<ChecklistItem[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("checklist_items")
    .select("*")
    .order("section")
    .order("label");
  return (data as ChecklistItem[]) ?? [];
}

export async function updateChecklistItem(
  id: string,
  completed: boolean,
  completedBy?: string
): Promise<ChecklistItem> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("checklist_items")
    .update({
      completed,
      completed_by: completed ? (completedBy ?? null) : null,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as ChecklistItem;
}

// ─── Dashboard summary stats ──────────────────────────────────────────────────

export type ManagementStats = {
  totalWins: number;
  totalLosses: number;
  totalSponsorshipRevenue: number;
  outstandingInvoices: number;
  nextTournamentDate: string | null;
  nextTournamentName: string | null;
};

export async function getManagementStats(): Promise<ManagementStats> {
  if (!supabase) {
    return {
      totalWins: 0,
      totalLosses: 0,
      totalSponsorshipRevenue: 0,
      outstandingInvoices: 0,
      nextTournamentDate: null,
      nextTournamentName: null,
    };
  }

  const [tournaments, sponsors, revenue] = await Promise.all([
    supabase.from("tournaments").select("wins,losses,status,date_start,name"),
    supabase.from("sponsors").select("deal_value,paid_to_date,status"),
    supabase.from("revenue").select("category,amount,received"),
  ]);

  const rows = (tournaments.data ?? []) as {
    wins: number; losses: number; status: string; date_start: string; name: string;
  }[];
  const completed = rows.filter((r) => r.status === "Completed");
  const totalWins = completed.reduce((s, r) => s + (r.wins ?? 0), 0);
  const totalLosses = completed.reduce((s, r) => s + (r.losses ?? 0), 0);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = rows
    .filter((r) => r.status === "Upcoming" && r.date_start >= today)
    .sort((a, b) => a.date_start.localeCompare(b.date_start));
  const nextTournamentDate = upcoming[0]?.date_start ?? null;
  const nextTournamentName = upcoming[0]?.name ?? null;

  const sponsorRows = (sponsors.data ?? []) as { deal_value: number; paid_to_date: number; status: string }[];
  const outstandingInvoices = sponsorRows
    .filter((s) => s.status !== "Lapsed" && s.status !== "Prospect")
    .reduce((sum, s) => sum + Math.max(0, (s.deal_value ?? 0) - (s.paid_to_date ?? 0)), 0);

  const revenueRows = (revenue.data ?? []) as { category: string; amount: number; received: boolean }[];
  const totalSponsorshipRevenue = revenueRows
    .filter((r) => r.category === "Sponsorship" && r.received)
    .reduce((sum, r) => sum + (r.amount ?? 0), 0);

  return {
    totalWins,
    totalLosses,
    totalSponsorshipRevenue,
    outstandingInvoices,
    nextTournamentDate,
    nextTournamentName,
  };
}
