import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const status: Record<string, unknown> = {
    ok: true,
    timestamp: new Date().toISOString(),
    supabase: "unconfigured",
  };

  if (supabase) {
    try {
      const { error } = await supabase.from("players").select("count").limit(1).single();
      status.supabase = error ? `error: ${error.message}` : "connected";
    } catch (e) {
      status.supabase = `unreachable: ${e instanceof Error ? e.message : "unknown"}`;
      status.ok = false;
    }
  }

  const httpStatus = status.ok ? 200 : 503;
  return Response.json(status, { status: httpStatus });
}
