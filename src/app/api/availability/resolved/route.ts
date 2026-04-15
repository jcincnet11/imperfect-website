import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAllPlayers, resolveAvailability, type ResolvedDay } from "@/lib/db";
import { resolveOrgRole, hasRole } from "@/lib/permissions";
import { apiError } from "@/lib/api-error";

/**
 * GET /api/availability/resolved?division=IMPerfect&weeks=4
 * MANAGER+ — returns pre-resolved availability for all active players
 * in a division over the next N weeks (default 4).
 * Used by the scrim scheduling overlay to show team availability at a glance.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const user = session.user as Record<string, unknown>;
    const orgRole = resolveOrgRole({ discordId: user.discordId as string, orgRole: user.orgRole as string });
    if (!hasRole(orgRole, "MANAGER")) {
      return apiError("Forbidden", 403);
    }

    const division = request.nextUrl.searchParams.get("division");
    if (!division) return apiError("division parameter required", 400);

    const weeks = Math.min(parseInt(request.nextUrl.searchParams.get("weeks") ?? "4", 10), 8);

    // Date range: today through N weeks from now
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10);
    const endDate = new Date(today.getTime() + weeks * 7 * 86400000).toISOString().slice(0, 10);

    // Get active players in this division
    const allPlayers = await getAllPlayers();
    const teamPlayers = allPlayers.filter((p) => p.division === division && !p.archived);

    // Resolve availability for each player in parallel
    const results: Record<string, ResolvedDay[]> = {};
    await Promise.all(
      teamPlayers.map(async (player) => {
        results[player.discord_id] = await resolveAvailability(player.discord_id, startDate, endDate);
      }),
    );

    return Response.json(
      {
        division,
        startDate,
        endDate,
        players: teamPlayers.map((p) => ({ discord_id: p.discord_id, display_name: p.display_name })),
        availability: results,
      },
      { headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=600" } },
    );
  } catch (e) {
    console.error("GET /api/availability/resolved", e);
    return apiError("Internal server error", 500);
  }
}
