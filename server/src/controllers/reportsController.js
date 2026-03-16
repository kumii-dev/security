import * as kumii from '../services/kumiiApiService.js';
import { supabaseAdmin } from '../integrations/supabase.js';

const token = (req) => req.headers.authorization?.split(' ')[1];

export async function getReport(req, res, next) {
  try {
    const { type } = req.params;
    const data = await kumii.generateReport(type, req.query, token(req));
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

/**
 * POST /api/reports/export-log
 * Client-side exports call this to record the export in Supabase.
 */
export async function logExport(req, res, next) {
  try {
    const { reportType, format, rowCount } = req.body;
    const { error } = await supabaseAdmin.from('report_exports').insert({
      admin_id: req.admin.id,
      admin_email: req.admin.email,
      report_type: reportType,
      export_format: format,
      row_count: rowCount || null,
    });
    if (error) throw error;
    return res.json({ success: true });
  } catch (err) { next(err); }
}
