import { environment } from "@/configs/environment";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const { SUPABASE_URL, SUPABASE_KEY } = environment;

  return createSupabaseClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
