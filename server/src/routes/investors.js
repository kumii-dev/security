import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { list, getOne, getActivity } from '../controllers/investorsController.js';

const router = Router();
router.use(requireAuth);

router.get('/', list);
router.get('/:id', getOne);
router.get('/:id/activity', getActivity);

export default router;
