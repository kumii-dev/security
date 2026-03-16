/**
 * App router — defines all routes with protection and lazy loading
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import LoadingScreen from '../components/ui/LoadingScreen';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage'));
const AuthSuccessPage = lazy(() => import('../pages/auth/AuthSuccessPage'));
const UnauthorizedPage = lazy(() => import('../pages/auth/UnauthorizedPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StartupsPage = lazy(() => import('../pages/startups/StartupsPage'));
const StartupDetailPage = lazy(() => import('../pages/startups/StartupDetailPage'));
const ApplicationsPage = lazy(() => import('../pages/applications/ApplicationsPage'));
const ApplicationDetailPage = lazy(() => import('../pages/applications/ApplicationDetailPage'));
const InvestorsPage = lazy(() => import('../pages/investors/InvestorsPage'));
const InvestorDetailPage = lazy(() => import('../pages/investors/InvestorDetailPage'));
const OpportunitiesPage = lazy(() => import('../pages/OpportunitiesPage'));
const PipelinePage = lazy(() => import('../pages/PipelinePage'));
const ImpactPage = lazy(() => import('../pages/ImpactPage'));
const CompliancePage = lazy(() => import('../pages/CompliancePage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const TasksPage = lazy(() => import('../pages/TasksPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AuditLogsPage = lazy(() => import('../pages/AuditLogsPage'));

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/auth-success" element={<AuthSuccessPage />} />
            <Route path="/auth/success" element={<AuthSuccessPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected admin routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              <Route path="startups" element={
                <ProtectedRoute module="startups"><StartupsPage /></ProtectedRoute>
              } />
              <Route path="startups/:id" element={
                <ProtectedRoute module="startups"><StartupDetailPage /></ProtectedRoute>
              } />

              <Route path="applications" element={
                <ProtectedRoute module="applications"><ApplicationsPage /></ProtectedRoute>
              } />
              <Route path="applications/:id" element={
                <ProtectedRoute module="applications"><ApplicationDetailPage /></ProtectedRoute>
              } />

              <Route path="investors" element={
                <ProtectedRoute module="investors"><InvestorsPage /></ProtectedRoute>
              } />
              <Route path="investors/:id" element={
                <ProtectedRoute module="investors"><InvestorDetailPage /></ProtectedRoute>
              } />

              <Route path="opportunities" element={
                <ProtectedRoute module="opportunities"><OpportunitiesPage /></ProtectedRoute>
              } />

              <Route path="pipeline" element={
                <ProtectedRoute module="pipeline"><PipelinePage /></ProtectedRoute>
              } />

              <Route path="impact" element={
                <ProtectedRoute module="impact"><ImpactPage /></ProtectedRoute>
              } />

              <Route path="compliance" element={
                <ProtectedRoute module="compliance"><CompliancePage /></ProtectedRoute>
              } />

              <Route path="reports" element={
                <ProtectedRoute module="reports"><ReportsPage /></ProtectedRoute>
              } />

              <Route path="tasks" element={
                <ProtectedRoute module="tasks"><TasksPage /></ProtectedRoute>
              } />

              <Route path="settings" element={
                <ProtectedRoute roles={['super_admin']}><SettingsPage /></ProtectedRoute>
              } />

              <Route path="audit-logs" element={
                <ProtectedRoute module="audit-logs"><AuditLogsPage /></ProtectedRoute>
              } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
