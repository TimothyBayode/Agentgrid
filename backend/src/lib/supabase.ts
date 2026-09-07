import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "../config/env.js";

/**
 * Server-side Supabase client using the service role key. The service role
 * bypasses Row Level Security, so it must never be exposed to the frontend.
 * The Privy access token remains the identity authority; Supabase only stores
 * the synchronized profile, wallets, and marketplace state.
 */
export const supabase: SupabaseClient = createClient(
  serverEnv.supabaseUrl,
  serverEnv.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
