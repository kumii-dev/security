import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { getStatus, getAlerts } from '../controllers/complianceController.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('super_admin', 'compliance_officer', 'funding_manager', 'executive_view'));

router.get('/status', getStatus);
router.get('/alerts', getAlerts);

export default router;
