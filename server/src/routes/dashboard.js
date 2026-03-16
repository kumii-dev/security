import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getMetrics, getAnalytics, getAlerts, getRecentActivity, getStats } from '../controllers/dashboardController.js';

const router = Router();
router.use(requireAuth);

router.get('/metrics', getMetrics);
router.get('/analytics', getAnalytics);
router.get('/alerts', getAlerts);
router.get('/recent-activity', getRecentActivity);
router.get('/stats', getStats); // legacy alias

export default router;
