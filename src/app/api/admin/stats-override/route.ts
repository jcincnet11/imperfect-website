import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { upsertStatsOverride } from "@/lib/db";
import { resolveOrgRole, hasRole } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";
import { verifyCsrfOrigin } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = resolveOrgRole(session.user);
    if (!hasRole(role, "ORG_ADMIN")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    if (!verifyCsrfOrigin(req)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });

    const body = await req.json() as {
      discord_id: string;
      mr_username?: string;
      use_override: boolean;
      rank_name?: string;
      win_rate?: number;
      kda?: number;
      matches?: number;
      top_heroes?: { name: string; role: string; matchesPlayed: number; winRate: number; kda: number }[];
    };

    if (!body.discord_id) {
      return NextResponse.json({ error: "discord_id is required" }, { status: 400 });
    }

    await upsertStatsOverride(body.discord_id, {
      mr_username: body.mr_username ?? null,
      use_override: body.use_override,
      rank_name: body.rank_name ?? null,
      win_rate: body.win_rate ?? null,
      kda: body.kda ?? null,
      matches: body.matches ?? null,
      top_heroes: body.top_heroes ?? [],
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/stats-override", e);
    return apiError("Internal server error", 500);
  }
}
