/**
 * Centralized configuration — load and validate environment variables
 */
import { config } from 'dotenv';
config();

function require_env(key) {
  const val = process.env[key];
  if (!val) {
    console.error(`[config] Missing required environment variable: ${key}`);
    // Return a placeholder so the process starts; routes will still fail gracefully
    return `MISSING_${key}`;
  }
  return val;
}

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Microsoft Entra ID — GEN Africa 22 ON SLOANE (tenant: 7ecb6702-3bbc-4ed1-a666-e203977bab9b)
  azure: {
    tenantId: require_env('AZURE_TENANT_ID'),
    clientId: require_env('AZURE_CLIENT_ID'),
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    allowedGroups: (process.env.AZURE_ALLOWED_GROUPS || '').split(',').filter(Boolean),
    // Default to 22onsloane.co + kumii.africa; override via AZURE_ALLOWED_DOMAINS for changes
    allowedDomains: (process.env.AZURE_ALLOWED_DOMAINS || '22onsloane.co,kumii.africa').split(',').map(d => d.trim()).filter(Boolean),
  },

  // Supabase
  supabase: {
    url: require_env('SUPABASE_URL'),
    anonKey: require_env('SUPABASE_ANON_KEY'),
    serviceRoleKey: require_env('SUPABASE_SERVICE_ROLE_KEY'),
    jwtSecret: require_env('SUPABASE_JWT_SECRET'),
  },

  // Kumii Africa API
  kumiiApi: {
    baseUrl: process.env.KUMII_API_BASE_URL || 'https://kumii.africa/api',
    apiKey: process.env.KUMII_API_KEY,
  },

  // JWT signing secret for backend-issued session tokens
  jwtSecret: require_env('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',

  // CORS
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
};
