import { supabaseAdmin } from '../integrations/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Upsert an admin user record in Supabase after successful Microsoft auth.
 * @param {object} msIdentity  Decoded Microsoft token claims
 * @param {string} role        Assigned Kumii role
 * @returns {Promise<object>}  Upserted admin user row
 */
export async function upsertAdminUser(msIdentity, role) {
  const { oid, email, preferred_username, name, tid } = msIdentity;

  const userEmail = email || preferred_username;

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .upsert(
      {
        microsoft_oid: oid,
        email: userEmail,
        display_name: name || userEmail,
        role,
        tenant_id: tid,
        last_login_at: new Date().toISOString(),
        is_active: true,
      },
      { onConflict: 'microsoft_oid', returning: 'representation' }
    )
    .select()
    .single();

  if (error) {
    logger.error({ event: 'upsert_admin_user_failed', email: userEmail, error: error.message });
    throw error;
  }

  return data;
}

/**
 * Fetch admin user by Supabase row ID.
 */
export async function getAdminUserById(id) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}

/**
 * Fetch admin user by Microsoft OID.
 */
export async function getAdminUserByOid(oid) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('microsoft_oid', oid)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}

/**
 * List all admin users (super_admin only).
 */
export async function listAdminUsers() {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, email, display_name, role, last_login_at, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Update a user's role.
 */
export async function updateAdminUserRole(id, role) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deactivate (soft-delete) an admin user.
 */
export async function deactivateAdminUser(id) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
