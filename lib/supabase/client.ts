// deno-lint-ignore-file no-explicit-any
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.47.10";

export const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing environment variables SUPABASE_URL or SUPABASE_ANON_KEY",
  );
}

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient: () => SupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
};

export class SupabaseInfo {
  private client;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  getUrl() {
    // Safe abstraction of protected property
    return (this.client as any).supabaseUrl;
  }

  getAnonKey() {
    // Safe abstraction of protected property
    return (this.client as any).supabaseKey;
  }
}
