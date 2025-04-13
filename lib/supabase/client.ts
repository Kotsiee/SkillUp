// deno-lint-ignore-file no-explicit-any

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

// client.ts
const isDeployed = !!Deno.env.get('DENO_DEPLOYMENT_ID');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? (isDeployed ? undefined : 'dummy-local-value');
const supabaseAnonKey =
  Deno.env.get('SUPABASE_ANON_KEY') ?? (isDeployed ? undefined : 'dummy-local-value');

if (isDeployed && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing environment variables…');
}

export const supabase: SupabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
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
