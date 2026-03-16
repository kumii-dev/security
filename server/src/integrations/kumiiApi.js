/**
 * Kumii Africa API client — centralised HTTP client with retry logic
 */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

const kumiiClient = axios.create({
  baseURL: config.kumiiApi.baseUrl,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    ...(config.kumiiApi.apiKey ? { 'X-API-Key': config.kumiiApi.apiKey } : {}),
  },
});

// Retry idempotent GET requests up to 3 times
axiosRetry(kumiiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response?.status === 503,
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(`Retrying Kumii API call (attempt ${retryCount}): ${requestConfig.url} — ${error.message}`);
  },
});

// Logging interceptor
kumiiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error(`Kumii API error: ${error.config?.url} — ${error.message}`);
    return Promise.reject(error);
  }
);

/**
 * Forward admin's Microsoft token to Kumii API if required
 */
export function kumiiRequest(adminToken) {
  if (adminToken) {
    kumiiClient.defaults.headers['X-Admin-Token'] = adminToken;
  }
  return kumiiClient;
}

export default kumiiClient;
