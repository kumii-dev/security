import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { auditLog } from '../middleware/auditLog.js';
import { list, getOne, updateStage, getInvestorMatches } from '../controllers/startupsController.js';

const router = Router();
router.use(requireAuth);

router.get('/', list);
router.get('/:id', getOne);
router.get('/:id/investor-matches', getInvestorMatches);
router.patch(
  '/:id/stage',
  requireRole('super_admin', 'funding_manager'),
  auditLog({ action: 'UPDATE_STAGE', entityType: 'startup' }),
  updateStage
);

export default router;
