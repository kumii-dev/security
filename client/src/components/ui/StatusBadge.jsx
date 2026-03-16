/**
 * Status/compliance badge component
 */
import React from 'react';

const BADGE_STYLES = {
  // Pipeline / application stages
  draft: 'badge-gray',
  submitted: 'badge-blue',
  under_review: 'badge-orange',
  investor_matched: 'badge bg-purple-100 text-purple-800',
  due_diligence: 'badge-yellow',
  approved: 'badge-green',
  funded: 'badge bg-emerald-100 text-emerald-800',
  rejected: 'badge-red',
  // Task statuses
  open: 'badge-blue',
  'in progress': 'badge-orange',
  completed: 'badge-green',
  blocked: 'badge-red',
  // Compliance
  compliant: 'badge-green',
  needs_attention: 'badge-yellow',
  critical: 'badge-red',
  // Priority
  low: 'badge-gray',
  medium: 'badge-blue',
  high: 'badge-orange',
  critical_priority: 'badge-red',
  // Generic
  active: 'badge-green',
  inactive: 'badge-gray',
  pending: 'badge-yellow',
};

function StatusBadge({ status, label }) {
  const normalized = status?.toLowerCase().replace(/ /g, '_');
  const style = BADGE_STYLES[normalized] || BADGE_STYLES[status?.toLowerCase()] || 'badge-gray';
  return (
    <span className={style}>
      {label || status}
    </span>
  );
}

export default StatusBadge;
