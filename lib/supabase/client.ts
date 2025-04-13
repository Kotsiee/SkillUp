// deno-lint-ignore-file no-explicit-any

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables SUPABASE_URL or SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export class SupabaseInfo {
  private client;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  getUrl() {
    return (this.client as any).supabaseUrl;
  }

  getAnonKey() {
    return (this.client as any).supabaseKey;
  }
}
