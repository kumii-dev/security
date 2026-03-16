import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <ShieldExclamationIcon className="w-16 h-16 text-accent-500 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-500 mb-6 max-w-sm">
        You don't have permission to view this page. Contact your system administrator if you believe this is an error.
      </p>
      <Link to="/dashboard" className="btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
}

export default UnauthorizedPage;
