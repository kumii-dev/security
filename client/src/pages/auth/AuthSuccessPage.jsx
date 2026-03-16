/**
 * AuthSuccessPage — shown inside the iframe after successful Microsoft login.
 * Fires MSAL_AUTH_SUCCESS to the parent (kumii.africa) which then navigates
 * the parent page to /admin/audit-logs.
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TRUSTED_PARENT = 'https://kumii.africa';

function AuthSuccessPage() {
  const { isAuthenticated, adminUser } = useAuth();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || sent) return;

    // Notify parent frame
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'MSAL_AUTH_SUCCESS' }, TRUSTED_PARENT);
    }
    setSent(true);
  }, [isAuthenticated, sent]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-card border border-surface-border p-8 max-w-sm w-full text-center">
        {/* Check icon */}
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">Identity Verified</h2>

        {adminUser && (
          <p className="text-slate-600 text-sm mb-1">
            Welcome, <span className="font-semibold text-slate-800">{adminUser.display_name}</span>
          </p>
        )}

        <p className="text-slate-500 text-sm mb-6">
          Microsoft authentication successful. Redirecting you to Audit Logs…
        </p>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AuthSuccessPage;
