/**
 * TypeScript-style JSDoc type definitions for the Kumii Admin platform
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} email
 * @property {string} display_name
 * @property {string} entra_object_id
 * @property {string} role
 * @property {boolean} is_active
 * @property {string} last_login_at
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AuthSession
 * @property {AdminUser} user
 * @property {string} accessToken
 * @property {number} expiresAt
 */

/**
 * @typedef {Object} Startup
 * @property {string} id
 * @property {string} name
 * @property {string} founder
 * @property {string} sector
 * @property {string} province
 * @property {number} funding_ask
 * @property {number} readiness_score
 * @property {number} compliance_score
 * @property {string} application_status
 * @property {string} last_activity
 * @property {string} stage
 * @property {boolean} women_led
 * @property {boolean} youth_led
 * @property {boolean} township_venture
 */

/**
 * @typedef {Object} Application
 * @property {string} id
 * @property {string} startup_id
 * @property {string} startup_name
 * @property {number} funding_ask
 * @property {string} stage
 * @property {string} sector
 * @property {string} status
 * @property {string} investor_id
 * @property {string} opportunity_id
 * @property {string} created_at
 * @property {boolean} priority_flag
 */

/**
 * @typedef {Object} Investor
 * @property {string} id
 * @property {string} fund_name
 * @property {string} investor_type
 * @property {string[]} sector_focus
 * @property {string[]} geography
 * @property {number} ticket_size_min
 * @property {number} ticket_size_max
 * @property {boolean} impact_focus
 * @property {number} meetings
 * @property {number} approvals
 * @property {number} rejections
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id
 * @property {string} admin_user_id
 * @property {string} action_type
 * @property {string} entity_type
 * @property {string} entity_id
 * @property {string} action_summary
 * @property {Object} metadata_json
 * @property {string} ip_address
 * @property {string} user_agent
 * @property {string} created_at
 */

/**
 * @typedef {Object} AdminTask
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} related_entity_type
 * @property {string} related_entity_id
 * @property {string} assigned_to
 * @property {string} priority
 * @property {string} status
 * @property {string} due_date
 * @property {string} created_by
 * @property {string} created_at
 */

/**
 * @typedef {Object} KPICard
 * @property {string} label
 * @property {string|number} value
 * @property {number} delta
 * @property {string} deltaLabel
 * @property {string} icon
 * @property {string} color
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} data
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 * @property {number} totalPages
 */

export {};
