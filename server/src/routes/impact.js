import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getMetrics, getTopPerformers } from '../controllers/impactController.js';

const router = Router();
router.use(requireAuth);

router.get('/metrics', getMetrics);
router.get('/top-performers', getTopPerformers);

export default router;
