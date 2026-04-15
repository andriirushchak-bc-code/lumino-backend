import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _public: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (!_public) {
    _public = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!
    );
  }
  return _public;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );
  }
  return _admin;
}
