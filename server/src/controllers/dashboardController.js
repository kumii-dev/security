import { getDashboardStats, getDashboardAlerts } from '../services/kumiiApiService.js';
import { supabaseAdmin } from '../integrations/supabase.js';

/**
 * GET /api/dashboard/stats
 */
export async function getStats(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const stats = await getDashboardStats(token);
    return res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/alerts
 */
export async function getAlerts(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const [kumiiAlerts, { data: systemAlerts }] = await Promise.all([
      getDashboardAlerts(token).catch(() => []),
      supabaseAdmin
        .from('system_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);
    return res.json({ success: true, data: { kumii: kumiiAlerts, system: systemAlerts || [] } });
  } catch (err) {
    next(err);
  }
}
