import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { list, trafficStats } from '../controllers/auditLogsController.js';
import { validateAuditLogQuery } from '../validators/index.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('super_admin', 'compliance_officer'));

router.get('/', validateAuditLogQuery, list);
router.get('/traffic', trafficStats);

export default router;
