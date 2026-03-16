import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ErrorState({ message = 'Something went wrong.', retry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mb-3" />
      <p className="text-slate-600 text-sm font-medium">Error</p>
      <p className="text-slate-500 text-sm mt-1">{message}</p>
      {retry && (
        <button onClick={retry} className="btn-secondary mt-4 text-xs">
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
