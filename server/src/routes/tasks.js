import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { auditLog } from '../middleware/auditLog.js';
import { list, create, update, remove } from '../controllers/tasksController.js';
import { validateCreateTask, validateUpdateTask, validatePagination } from '../validators/index.js';

const router = Router();
router.use(requireAuth);

router.get('/', validatePagination, list);
router.post('/', validateCreateTask, auditLog({ action: 'CREATE', entityType: 'task' }), create);
router.patch('/:id', validateUpdateTask, auditLog({ action: 'UPDATE', entityType: 'task' }), update);
router.delete(
  '/:id',
  requireRole('super_admin', 'funding_manager'),
  auditLog({ action: 'DELETE', entityType: 'task' }),
  remove
);

export default router;
