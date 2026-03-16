import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getSummary, getDeals } from '../controllers/pipelineController.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', getSummary);
router.get('/deals', getDeals);

export default router;
