/**
 * Supabase client — service-role client for backend use only
 * Never expose this to the frontend
 */
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';

// Service-role client — full DB access, bypasses RLS
// Used ONLY on the backend, never sent to the client
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabaseAdmin;
