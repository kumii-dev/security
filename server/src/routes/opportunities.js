import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { auditLog } from '../middleware/auditLog.js';
import { list, getOne, create, update } from '../controllers/opportunitiesController.js';

const router = Router();
router.use(requireAuth);

router.get('/', list);
router.get('/:id', getOne);
router.post(
  '/',
  requireRole('super_admin', 'funding_manager'),
  auditLog({ action: 'CREATE', entityType: 'opportunity' }),
  create
);
router.put(
  '/:id',
  requireRole('super_admin', 'funding_manager'),
  auditLog({ action: 'UPDATE', entityType: 'opportunity' }),
  update
);

export default router;
