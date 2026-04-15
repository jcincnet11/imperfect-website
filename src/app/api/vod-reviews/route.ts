import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getAllVodReviews } from "@/lib/db";
import { apiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    if (!checkRateLimit(request)) return Response.json({ error: "Too many requests" }, { status: 429 });

    const session = await auth();
    if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const reviews = await getAllVodReviews();
    return Response.json(reviews, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" },
    });
  } catch (e) {
    console.error("GET /api/vod-reviews", e);
    return apiError("Internal server error", 500);
  }
}
