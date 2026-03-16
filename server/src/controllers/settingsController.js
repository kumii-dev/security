import { supabaseAdmin } from '../integrations/supabase.js';
import { listAdminUsers, updateAdminUserRole, deactivateAdminUser } from '../services/adminUserService.js';

// ── System settings ────────────────────────────────────────────────────────
export async function getSettings(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .order('key', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function upsertSetting(req, res, next) {
  try {
    const { key, value, description } = req.body;
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .upsert({ key, value, description, updated_by: req.admin.id, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select()
      .single();
    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

// ── Admin user management (super_admin only) ───────────────────────────────
export async function getAdminUsers(req, res, next) {
  try {
    const data = await listAdminUsers();
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const data = await updateAdminUserRole(req.params.userId, role);
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function deactivateUser(req, res, next) {
  try {
    const data = await deactivateAdminUser(req.params.userId);
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}
