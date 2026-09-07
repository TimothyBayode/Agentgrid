import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "../config/env.js";

/**
 * Server-side Supabase client using the service role key. The service role
 * bypasses Row Level Security, so it must never be exposed to the frontend.
 * The Privy access token remains the identity authority; Supabase only stores
 * the synchronized profile, wallets, and marketplace state.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(serverEnv.supabaseUrl && serverEnv.supabaseServiceRoleKey);
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!isSupabaseConfigured()) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured");
    }
    client = createClient(serverEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return client;
}
