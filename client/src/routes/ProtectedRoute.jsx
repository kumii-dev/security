/**
 * Route guard — protects pages from unauthenticated and unauthorized access
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/ui/LoadingScreen';

/**
 * ProtectedRoute — requires authentication + optional module permission check
 * @param {React.ReactNode} children
 * @param {string} [module] - permission module key (e.g. 'startups', 'compliance')
 * @param {string[]} [roles] - allowed roles array
 */
function ProtectedRoute({ children, module, roles }) {
  const { isAuthenticated, loading, adminUser, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based check
  if (roles && roles.length > 0 && !roles.includes(adminUser?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Module permission check
  if (module && !hasPermission(module)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
