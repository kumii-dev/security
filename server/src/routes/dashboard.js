import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getStats, getAlerts } from '../controllers/dashboardController.js';

const router = Router();
router.use(requireAuth);

router.get('/stats', getStats);
router.get('/alerts', getAlerts);

export default router;
