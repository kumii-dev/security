/**
 * Centralized API service for communicating with the Kumii Admin backend (BFF)
 * The backend proxies/aggregates from kumii.africa APIs and Supabase
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach stored access token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('kumii_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session and redirect to login
      sessionStorage.clear();
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Exchange Microsoft token for Kumii admin session
   * @param {string} microsoftToken - ID token from MSAL
   */
  verifyAndLogin: (microsoftToken) =>
    apiClient.post('/auth/login', { token: microsoftToken }),

  /**
   * Logout — invalidate server-side session + clear audit log
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Get current admin profile
   */
  getProfile: () => apiClient.get('/auth/me'),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardService = {
  getMetrics: () => apiClient.get('/dashboard/metrics'),
  getAnalytics: () => apiClient.get('/dashboard/analytics'),
  getAlerts: () => apiClient.get('/dashboard/alerts'),
  getRecentActivity: () => apiClient.get('/dashboard/recent-activity'),
};

// ─── Startups ─────────────────────────────────────────────────────────────────

export const startupsService = {
  /**
   * @param {Object} params - filters, pagination
   */
  getAll: (params = {}) => apiClient.get('/startups', { params }),
  getById: (id) => apiClient.get(`/startups/${id}`),
  getReadiness: (id) => apiClient.get(`/startups/${id}/readiness`),
  getMatches: (id) => apiClient.get(`/startups/${id}/matches`),
};

// ─── Applications ─────────────────────────────────────────────────────────────

export const applicationsService = {
  getAll: (params = {}) => apiClient.get('/applications', { params }),
  getById: (id) => apiClient.get(`/applications/${id}`),
  updateStatus: (id, payload) => apiClient.patch(`/applications/${id}`, payload),
  getByStage: (stage) => apiClient.get('/applications', { params: { stage } }),
};

// ─── Investors ────────────────────────────────────────────────────────────────

export const investorsService = {
  getAll: (params = {}) => apiClient.get('/investors', { params }),
  getById: (id) => apiClient.get(`/investors/${id}`),
};

// ─── Funding Opportunities ────────────────────────────────────────────────────

export const opportunitiesService = {
  getAll: (params = {}) => apiClient.get('/opportunities', { params }),
  getById: (id) => apiClient.get(`/opportunities/${id}`),
};

// ─── Impact ───────────────────────────────────────────────────────────────────

export const impactService = {
  getMetrics: (params = {}) => apiClient.get('/impact', { params }),
  getByProvince: () => apiClient.get('/impact/by-province'),
  getBySector: () => apiClient.get('/impact/by-sector'),
  getTrends: () => apiClient.get('/impact/trends'),
};

// ─── Compliance ───────────────────────────────────────────────────────────────

export const complianceService = {
  getSummary: () => apiClient.get('/compliance'),
  getAlerts: () => apiClient.get('/compliance/alerts'),
  getByStartup: (startupId) => apiClient.get(`/compliance/startup/${startupId}`),
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reportsService = {
  getCapitalRaised: (params = {}) => apiClient.get('/reports/capital-raised', { params }),
  getStartupReadiness: (params = {}) => apiClient.get('/reports/startup-readiness', { params }),
  getApplicationConversion: (params = {}) => apiClient.get('/reports/application-conversion', { params }),
  getInvestorActivity: (params = {}) => apiClient.get('/reports/investor-activity', { params }),
  getImpact: (params = {}) => apiClient.get('/reports/impact', { params }),
  getCompliance: (params = {}) => apiClient.get('/reports/compliance', { params }),
  /**
   * Log and record an export
   */
  exportReport: (type, format, params = {}) =>
    apiClient.post('/reports/export', { type, format, params }),
};

// ─── Admin Tasks ──────────────────────────────────────────────────────────────

export const tasksService = {
  getAll: (params = {}) => apiClient.get('/tasks', { params }),
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (payload) => apiClient.post('/tasks', payload),
  update: (id, payload) => apiClient.patch(`/tasks/${id}`, payload),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditService = {
  getLogs: (params = {}) => apiClient.get('/audit-logs', { params }),
  getById: (id) => apiClient.get(`/audit-logs/${id}`),
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsService = {
  getAll: () => apiClient.get('/settings'),
  update: (key, value) => apiClient.put(`/settings/${key}`, { value }),
};

export default apiClient;
