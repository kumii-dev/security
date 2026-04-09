import { supabaseAdmin } from '../integrations/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Write a single audit log entry to Supabase.
 * This is intentionally fire-and-forget — callers should .catch(() => {}).
 *
 * @param {object} entry
 */
export async function writeAuditLog(entry) {
  const {
    adminId,
    adminEmail,
    action,
    entityType,
    entityId = null,
    metadata = {},
    ipAddress = null,
    userAgent = null,
  } = entry;

  const { error } = await supabaseAdmin.from('audit_logs').insert({
    admin_id: adminId || null,
    admin_email: adminEmail || null,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  if (error) {
    logger.error({ event: 'audit_log_write_failed', action, entityType, error: error.message });
  }
}

/**
 * Paginated query of audit_logs with filters.
 *
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.pageSize
 * @param {string} [options.search]      Partial match on admin_email or entity_id
 * @param {string} [options.action]
 * @param {string} [options.entityType]
 * @param {string} [options.dateFrom]    ISO string
 * @param {string} [options.dateTo]      ISO string
 */
export async function queryAuditLogs({ page = 1, pageSize = 50, search, action, entityType, dateFrom, dateTo }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`admin_email.ilike.%${search}%,entity_id.ilike.%${search}%`);
  }
  if (action) query = query.eq('action', action);
  if (entityType) query = query.eq('entity_type', entityType);
  if (dateFrom) query = query.gte('created_at', dateFrom);
  if (dateTo) query = query.lte('created_at', dateTo);

  const { data, error, count } = await query;
  if (error) throw error;

  return { data, total: count, page, pageSize };
}

/**
 * Aggregate traffic statistics for the Traffic tab.
 * Returns top IPs with request counts, error rates, unique users, and risk scores.
 *
 * @param {object} options
 * @param {string} [options.dateFrom]  ISO string
 * @param {string} [options.dateTo]    ISO string
 * @param {number} [options.limit]     Max IPs to return (default 20)
 */
export async function getTrafficStats({ dateFrom, dateTo, limit = 20 } = {}) {
  // Fetch all logs in the time window (cap at 5000 rows for perf)
  let query = supabaseAdmin
    .from('audit_logs')
    .select('ip_address, action, admin_email, created_at')
    .not('ip_address', 'is', null)
    .order('created_at', { ascending: false })
    .limit(5000);

  if (dateFrom) query = query.gte('created_at', dateFrom);
  if (dateTo)   query = query.lte('created_at', dateTo);

  const { data, error } = await query;
  if (error) throw error;

  // Aggregate per IP
  const ipMap = {};
  for (const row of data) {
    const ip = row.ip_address;
    if (!ip) continue;
    if (!ipMap[ip]) {
      ipMap[ip] = {
        ip,
        requestCount: 0,
        errorCount: 0,
        uniqueUsers: new Set(),
        lastSeen: row.created_at,
        actions: {},
      };
    }
    const entry = ipMap[ip];
    entry.requestCount++;
    if (row.created_at > entry.lastSeen) entry.lastSeen = row.created_at;
    if (row.admin_email) entry.uniqueUsers.add(row.admin_email);

    // Treat failed/error actions as errors
    const isError = row.action?.includes('fail') || row.action?.includes('error') || row.action?.includes('denied');
    if (isError) entry.errorCount++;

    entry.actions[row.action] = (entry.actions[row.action] || 0) + 1;
  }

  // Convert to array, compute derived fields, sort by requestCount desc
  const totalRequests = data.length;
  const rows = Object.values(ipMap)
    .map((e) => {
      const errorRate = e.requestCount > 0 ? e.errorCount / e.requestCount : 0;
      let riskScore = 'low';
      if (e.requestCount > 100 || errorRate > 0.5) riskScore = 'high';
      else if (e.requestCount > 20 || errorRate > 0.2) riskScore = 'medium';

      // Top action for this IP
      const topAction = Object.entries(e.actions).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

      return {
        ip: e.ip,
        requestCount: e.requestCount,
        errorCount: e.errorCount,
        errorRate: Math.round(errorRate * 100),
        uniqueUsers: e.uniqueUsers.size,
        lastSeen: e.lastSeen,
        riskScore,
        topAction,
        percentOfTotal: totalRequests > 0 ? Math.round((e.requestCount / totalRequests) * 100) : 0,
      };
    })
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, limit);

  return {
    topIps: rows,
    totalRequests,
    uniqueIps: Object.keys(ipMap).length,
    highRiskCount: rows.filter((r) => r.riskScore === 'high').length,
  };
}
