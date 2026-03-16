/**
 * Login page — Microsoft Entra ID only
 */
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const { isAuthenticated, loading, handleLogin, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to the page the user was trying to reach, or /dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onLogin = async () => {
    try {
      await handleLogin();
      navigate(from, { replace: true });
    } catch {
      // error already set in AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-primary-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-black text-2xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Kumii Admin</h1>
            <p className="text-slate-500 text-sm mt-1 text-center">
              Funding Operations Dashboard
            </p>
          </div>

          {/* Info box */}
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
            <p className="text-primary-800 text-sm font-medium mb-1">🔒 Authorized Personnel Only</p>
            <p className="text-primary-600 text-xs">
              This portal is restricted to Kumii Capital authorized administrators.
              Sign in with your Microsoft 365 work account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Microsoft Sign In Button */}
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 font-semibold text-sm hover:bg-slate-50 hover:border-primary-300 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-primary-700 rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
            )}
            {loading ? 'Signing in…' : 'Sign in with Microsoft'}
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to Kumii's admin usage policy.
            <br />Unauthorized access is prohibited.
          </p>
        </div>

        <p className="text-center text-primary-300 text-xs mt-6">
          © {new Date().getFullYear()} Kumii Capital Access Platform
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
