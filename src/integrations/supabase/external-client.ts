// External Supabase project client (user-provided credentials).
// Use this client for features that should read/write to the user's own
// Supabase project instead of Lovable Cloud.
//
// Import like:
//   import { supabaseExternal } from "@/integrations/supabase/external-client";
import { createClient } from "@supabase/supabase-js";

const EXTERNAL_SUPABASE_URL = "https://glylnfmhszlvaiqimxix.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "sb_publishable_jcoNiERx2jsD6dN_fu8yYQ_14RifH17";

export const supabaseExternal = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "sb-external-auth",
    },
  }
);
