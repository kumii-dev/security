import { queryAuditLogs } from '../services/auditLogService.js';

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
