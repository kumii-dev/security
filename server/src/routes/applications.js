import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { auditLog } from '../middleware/auditLog.js';
import { list, getOne, updateStage, addNote } from '../controllers/applicationsController.js';

const router = Router();
router.use(requireAuth);

router.get('/', list);
router.get('/:id', getOne);
router.patch(
  '/:id/stage',
  requireRole('super_admin', 'funding_manager'),
  auditLog({ action: 'UPDATE_STAGE', entityType: 'application' }),
  updateStage
);
router.post(
  '/:id/notes',
  requireRole('super_admin', 'funding_manager', 'investor_relations'),
  auditLog({ action: 'ADD_NOTE', entityType: 'application' }),
  addNote
);

export default router;
