/**
 * Microsoft MSAL (Azure AD / Entra ID) configuration
 * Uses PKCE flow for secure SPA authentication
 */
import { PublicClientApplication, LogLevel } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_POST_LOGOUT_URI || `${window.location.origin}/login`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Use sessionStorage for security (cleared on tab close)
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (import.meta.env.DEV) {
          switch (level) {
            case LogLevel.Error:
              console.error('[MSAL]', message);
              break;
            case LogLevel.Warning:
              console.warn('[MSAL]', message);
              break;
          }
        }
      },
      logLevel: import.meta.env.DEV ? LogLevel.Warning : LogLevel.Error,
    },
  },
};

// Scopes requested during login
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
  prompt: 'select_account',
};

// Scopes for backend API token
export const apiRequest = {
  scopes: [import.meta.env.VITE_AZURE_API_SCOPE || 'api://kumii-admin/.default'],
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize before rendering
await msalInstance.initialize();

export default msalConfig;
