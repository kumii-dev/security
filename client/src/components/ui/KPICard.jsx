/**
 * KPI Summary Card component
 */
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

function KPICard({ label, value, delta, deltaLabel, icon: Icon, color = 'blue', loading }) {
  const colorMap = {
    blue: 'bg-primary-50 text-primary-700',
    green: 'bg-secondary-50 text-secondary-700',
    orange: 'bg-accent-50 text-accent-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-amber-50 text-amber-700',
  };

  const isPositive = delta > 0;

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
        <div className="h-8 bg-slate-200 rounded w-16 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-20" />
      </div>
    );
  }

  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value ?? '—'}</p>
          {delta !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {isPositive ? (
                <ArrowUpIcon className="w-3 h-3 text-secondary-600" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 text-red-500" />
              )}
              <span
                className={`stat-delta ${
                  isPositive ? 'text-secondary-600' : 'text-red-500'
                }`}
              >
                {Math.abs(delta)}% {deltaLabel || 'vs last month'}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ml-3 ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default KPICard;
