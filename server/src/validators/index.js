import { body, param, query } from 'express-validator';
import { validationResult } from 'express-validator';

// ── Reusable handle ───────────────────────────────────────────────────────────
/**
 * Run after validator chains. Returns 422 with field errors if any.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', details: errors.array() },
    });
  }
  next();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const validateLogin = [
  body('idToken')
    .notEmpty().withMessage('idToken is required.')
    .isJWT().withMessage('idToken must be a valid JWT.'),
  validate,
];

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const validateCreateTask = [
  body('title')
    .trim().notEmpty().withMessage('title is required.')
    .isLength({ max: 200 }).withMessage('title must be ≤ 200 characters.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority.'),
  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status.'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('dueDate must be ISO 8601 (YYYY-MM-DD).'),
  body('assignedTo')
    .optional({ nullable: true })
    .isUUID().withMessage('assignedTo must be a valid UUID.'),
  validate,
];

export const validateUpdateTask = [
  param('id').isUUID().withMessage('Task id must be a UUID.'),
  body('title')
    .optional()
    .trim().notEmpty()
    .isLength({ max: 200 }).withMessage('title must be ≤ 200 characters.'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority.'),
  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status.'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('dueDate must be ISO 8601 (YYYY-MM-DD).'),
  validate,
];

// ── Settings ──────────────────────────────────────────────────────────────────
export const validateUpsertSetting = [
  body('key')
    .trim().notEmpty().withMessage('key is required.')
    .isLength({ max: 100 }).withMessage('key must be ≤ 100 characters.')
    .matches(/^[a-z0-9_]+$/).withMessage('key may only contain lowercase letters, digits, and underscores.'),
  body('value')
    .notEmpty().withMessage('value is required.'),
  validate,
];

export const validateUpdateRole = [
  param('userId').isUUID().withMessage('userId must be a UUID.'),
  body('role')
    .isIn(['super_admin', 'funding_manager', 'investor_relations', 'impact_analyst', 'compliance_officer', 'executive_view'])
    .withMessage('Invalid role.'),
  validate,
];

// ── Common pagination ─────────────────────────────────────────────────────────
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer.'),
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 200 }).withMessage('pageSize must be between 1 and 200.'),
  validate,
];

// ── Audit log filters ─────────────────────────────────────────────────────────
export const validateAuditLogQuery = [
  ...validatePagination.slice(0, -1), // omit validate middleware — we add it at end
  query('dateFrom')
    .optional()
    .isISO8601().withMessage('dateFrom must be ISO 8601.'),
  query('dateTo')
    .optional()
    .isISO8601().withMessage('dateTo must be ISO 8601.'),
  validate,
];

// ── Report export log ─────────────────────────────────────────────────────────
export const validateExportLog = [
  body('reportType').trim().notEmpty().withMessage('reportType is required.'),
  body('format')
    .isIn(['csv', 'excel', 'pdf']).withMessage('format must be csv, excel, or pdf.'),
  body('rowCount')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('rowCount must be a non-negative integer.'),
  validate,
];
