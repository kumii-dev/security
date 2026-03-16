import { supabaseAdmin } from '../integrations/supabase.js';

/**
 * GET /api/dashboard/metrics
 * Aggregates real counts from Supabase tables.
 */
export async function getMetrics(req, res, next) {
  try {
    const [
      { count: totalTasks },
      { count: openTasks },
      { count: totalUsers },
      { count: activeUsers },
      { count: totalLogs },
      { count: todayLogs },
    ] = await Promise.all([
      supabaseAdmin.from('admin_tasks').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('admin_tasks').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabaseAdmin.from('admin_users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('admin_users').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('audit_logs').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('audit_logs').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

    return res.json({
      success: true,
      data: {
        total_tasks: totalTasks || 0,
        open_tasks: openTasks || 0,
        total_admins: totalUsers || 0,
        active_admins: activeUsers || 0,
        total_audit_logs: totalLogs || 0,
        audit_logs_today: todayLogs || 0,
        total_startups: null,
        funding_ready_startups: null,
        active_investors: null,
        applications_submitted: null,
        deals_in_progress: null,
        capital_raised: null,
        jobs_created: null,
        women_led_startups: null,
        township_ventures: null,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/analytics
 * Audit log activity grouped by day — last 30 days.
 */
export async function getAnalytics(req, res, next) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: logs, error } = await supabaseAdmin
      .from('audit_logs')
      .select('created_at, action')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const byDate = {};
    (logs || []).forEach(({ created_at }) => {
      const day = created_at.slice(0, 10);
      byDate[day] = (byDate[day] || 0) + 1;
    });

    const trend = Object.entries(byDate).map(([date, count]) => ({ date, count }));
    return res.json({ success: true, data: { activity_trend: trend } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/alerts
 */
export async function getAlerts(req, res, next) {
  try {
    const { data: systemAlerts, error } = await supabaseAdmin
      .from('system_alerts')
      .select('*')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return res.json({ success: true, data: systemAlerts || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/recent-activity
 */
export async function getRecentActivity(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('id, admin_email, action, entity_type, entity_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    next(err);
  }
}

export const getStats = getMetrics;
