// lib/supabase/client.ts

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

export function getSupabaseClient(): SupabaseClient {
  const isDeployed = !!Deno.env.get('DENO_DEPLOYMENT_ID');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isDeployed) {
      throw new Error('Missing environment variables SUPABASE_URL or SUPABASE_ANON_KEY');
    }
    // Optional: allow fallback for local dev
    console.warn('Using fallback dummy keys in local dev');
    return createClient('http://localhost:54321', 'public-anon-key', {
      auth: { persistSession: false },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

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
