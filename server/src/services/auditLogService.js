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
