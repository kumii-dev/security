/**
 * Auth Context — manages admin session state globally
 * Integrates Microsoft MSAL with the Kumii backend verification layer
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';
import { authService } from '../services/api';
import { SESSION_IDLE_TIMEOUT } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { instance: msalInstance, accounts } = useMsal();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idleTimer, setIdleTimer] = useState(null);

  // ─── Idle session timeout ──────────────────────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    if (idleTimer) clearTimeout(idleTimer);
    const timer = setTimeout(() => {
      handleLogout('Session expired due to inactivity.');
    }, SESSION_IDLE_TIMEOUT);
    setIdleTimer(timer);
  }, [idleTimer]);

  useEffect(() => {
    if (adminUser) {
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach((e) => window.addEventListener(e, resetIdleTimer));
      resetIdleTimer();
      return () => {
        events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
        if (idleTimer) clearTimeout(idleTimer);
      };
    }
  }, [adminUser]);

  // ─── Restore session on load ───────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = sessionStorage.getItem('kumii_access_token');
        if (storedToken && accounts.length > 0) {
          const profile = await authService.getProfile();
          setAdminUser(profile.user);
        }
      } catch {
        sessionStorage.removeItem('kumii_access_token');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, [accounts]);

  // ─── Login with Microsoft ──────────────────────────────────────────────────
  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Trigger Microsoft popup login
      const msalResponse = await msalInstance.loginPopup(loginRequest);
      const idToken = msalResponse.idToken;

      // Send Microsoft token to backend for verification and admin sync
      const sessionData = await authService.verifyAndLogin(idToken);

      // Backend returns { success, data: { token, user } }
      const { token, user } = sessionData.data ?? sessionData;

      // Store the backend-issued token securely
      sessionStorage.setItem('kumii_access_token', token);
      setAdminUser(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async (reason) => {
    try {
      await authService.logout();
    } catch {
      // Ensure cleanup even if backend call fails
    }
    sessionStorage.clear();
    setAdminUser(null);
    if (idleTimer) clearTimeout(idleTimer);
    // Clear MSAL session
    await msalInstance.logoutPopup();
    window.location.href = '/login';
  };

  // ─── Permission check ─────────────────────────────────────────────────────
  const hasPermission = useCallback(
    (module) => {
      if (!adminUser) return false;
      const { ROLE_PERMISSIONS } = require('../constants');
      const perms = ROLE_PERMISSIONS[adminUser.role] || [];
      return perms.includes('*') || perms.includes(module);
    },
    [adminUser]
  );

  const isRole = useCallback(
    (role) => adminUser?.role === role,
    [adminUser]
  );

  const isSuperAdmin = useCallback(
    () => adminUser?.role === 'super_admin',
    [adminUser]
  );

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        loading,
        error,
        isAuthenticated: !!adminUser,
        handleLogin,
        handleLogout,
        hasPermission,
        isRole,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to consume auth context
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
