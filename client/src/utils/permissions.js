/**
 * Permission helper utilities
 */
import { ROLE_PERMISSIONS } from '../constants';

/**
 * Check if a role has access to a module
 * @param {string} role
 * @param {string} module
 */
export function canAccess(role, module) {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(module);
}

/**
 * Get all modules a role can access
 * @param {string} role
 */
export function getAccessibleModules(role) {
  if (!role) return [];
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes('*')) return Object.keys(ROLE_PERMISSIONS);
  return perms;
}

/**
 * Check if a role is read-only
 */
export function isReadOnlyRole(role) {
  return role === 'executive_view';
}
