/**
 * Full-screen loading spinner
 */
import React from 'react';

function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}

export default LoadingScreen;
