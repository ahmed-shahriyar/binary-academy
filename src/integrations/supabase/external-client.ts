// External Supabase project client (user-provided credentials).
// Use this client for features that should read/write to the user's own
// Supabase project instead of Lovable Cloud.
//
// Import like:
//   import { supabaseExternal } from "@/integrations/supabase/external-client";
import { createClient } from "@supabase/supabase-js";

const EXTERNAL_SUPABASE_URL = "https://glylnfmhszlvaiqimxix.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdseWxuZm1oc3psdmFpcWlteGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODIwMjcsImV4cCI6MjA5MzI1ODAyN30.csbi-Wx--6WonPjnhMPx0M6Ea4mL3JJXrj_NWiZn3w8";

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
