import React from 'react';
import { InboxIcon } from '@heroicons/react/24/outline';

function EmptyState({ message = 'No data available', action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxIcon className="w-12 h-12 text-slate-300 mb-3" />
      <p className="text-slate-500 text-sm">{message}</p>
      {action && (
        <button onClick={action} className="btn-primary mt-4 text-xs">
          {actionLabel || 'Add New'}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
