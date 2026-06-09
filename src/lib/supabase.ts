import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;

// Prefer the service role key on the server. It bypasses RLS, so app code keeps
// working after the allow-all anon policies are dropped. Fall back to the anon
// key so local dev still reads when the service role key is not set.
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;

export function isSupabaseConfigured() {
  return Boolean(url && key);
}
