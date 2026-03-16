/**
 * Application-wide constants
 */

export const APP_NAME = 'Kumii Admin';
export const APP_VERSION = '1.0.0';

// Admin roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  FUNDING_MANAGER: 'funding_manager',
  INVESTOR_RELATIONS: 'investor_relations',
  IMPACT_ANALYST: 'impact_analyst',
  COMPLIANCE_OFFICER: 'compliance_officer',
  EXECUTIVE_VIEW: 'executive_view',
};

// Role display labels
export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  funding_manager: 'Funding Manager',
  investor_relations: 'Investor Relations',
  impact_analyst: 'Impact Analyst',
  compliance_officer: 'Compliance Officer',
  executive_view: 'Executive View',
};

// Permission matrix: which modules each role can access
export const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  funding_manager: ['dashboard', 'startups', 'applications', 'pipeline', 'tasks', 'audit-logs'],
  investor_relations: ['dashboard', 'investors', 'opportunities', 'pipeline', 'tasks'],
  impact_analyst: ['dashboard', 'impact', 'reports', 'startups'],
  compliance_officer: ['dashboard', 'compliance', 'reports', 'audit-logs', 'startups'],
  executive_view: ['dashboard', 'reports', 'impact'],
};

// Application pipeline stages
export const PIPELINE_STAGES = [
  { id: 'draft', label: 'Draft', color: 'gray' },
  { id: 'submitted', label: 'Submitted', color: 'blue' },
  { id: 'under_review', label: 'Under Review', color: 'orange' },
  { id: 'investor_matched', label: 'Investor Matched', color: 'purple' },
  { id: 'due_diligence', label: 'Due Diligence', color: 'yellow' },
  { id: 'approved', label: 'Approved', color: 'green' },
  { id: 'funded', label: 'Funded', color: 'emerald' },
  { id: 'rejected', label: 'Rejected', color: 'red' },
];

// Task statuses
export const TASK_STATUSES = ['Open', 'In Progress', 'Completed', 'Blocked'];

// Task priorities
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

// Compliance status levels
export const COMPLIANCE_STATUS = {
  COMPLIANT: 'compliant',
  NEEDS_ATTENTION: 'needs_attention',
  CRITICAL: 'critical',
};

// South African provinces
export const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
];

// Startup sectors
export const SECTORS = [
  'Fintech',
  'Agritech',
  'Healthtech',
  'Edtech',
  'Cleantech',
  'Logistics',
  'E-commerce',
  'Manufacturing',
  'Tourism',
  'Media & Entertainment',
  'Real Estate',
  'Other',
];

// Funding stages
export const FUNDING_STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Other'];

// Investor types
export const INVESTOR_TYPES = [
  'Angel Investor',
  'Venture Capital',
  'Private Equity',
  'Development Finance Institution',
  'Corporate VC',
  'Impact Fund',
  'Government Grant',
];

// Report types
export const REPORT_TYPES = [
  'Capital Raised',
  'Startup Readiness',
  'Application Conversion',
  'Investor Activity',
  'Impact Report',
  'Compliance Report',
];

// Export formats
export const EXPORT_FORMATS = ['CSV', 'Excel', 'PDF'];

// Idle session timeout in milliseconds (15 minutes)
export const SESSION_IDLE_TIMEOUT = 15 * 60 * 1000;

// Pagination defaults
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 25;
