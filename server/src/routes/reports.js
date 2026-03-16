import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { auditLog } from '../middleware/auditLog.js';
import { getReport, logExport } from '../controllers/reportsController.js';
import { validateExportLog } from '../validators/index.js';

const router = Router();
router.use(requireAuth);

router.get('/:type', getReport);
router.post('/export-log', validateExportLog, auditLog({ action: 'EXPORT_REPORT', entityType: 'report' }), logExport);

export default router;
