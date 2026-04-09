import { queryAuditLogs, getTrafficStats, getDeviceStats } from '../services/auditLogService.js';

export async function list(req, res, next) {
  try {
    const { page, pageSize, search, action, entityType, dateFrom, dateTo } = req.query;
    const result = await queryAuditLogs({
      page: Number(page) || 1,
      pageSize: Math.min(Number(pageSize) || 50, 200),
      search,
      action,
      entityType,
      dateFrom,
      dateTo,
    });
    return res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function trafficStats(req, res, next) {
  try {
    const { dateFrom, dateTo, limit } = req.query;
    const result = await getTrafficStats({
      dateFrom,
      dateTo,
      limit: limit ? Math.min(Number(limit), 50) : 20,
    });
    return res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function deviceStats(req, res, next) {
  try {
    const { dateFrom, dateTo } = req.query;
    const result = await getDeviceStats({ dateFrom, dateTo });
    return res.json({ success: true, ...result });
  } catch (err) { next(err); }
}
