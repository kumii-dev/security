/**
 * Top navigation bar — breadcrumbs, search, notifications, admin avatar
 */
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../constants';

const BREADCRUMB_MAP = {
  dashboard: 'Dashboard',
  startups: 'Startups',
  applications: 'Applications',
  investors: 'Investors',
  opportunities: 'Funding Opportunities',
  pipeline: 'Deal Pipeline',
  impact: 'Impact Metrics',
  compliance: 'Compliance',
  reports: 'Reports',
  tasks: 'Admin Tasks',
  settings: 'Settings',
  'audit-logs': 'Audit Logs',
};

function TopNav({ onMenuClick }) {
  const { adminUser, handleLogout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Build simple breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSection = BREADCRUMB_MAP[pathParts[0]] || pathParts[0];

  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 shrink-0">
      {/* Left: menu + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bars3Icon className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-900">{currentSection}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            2026 Kumii (Powered by 22 On Sloane)
          </p>
        </div>
      </div>

      {/* Center: search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search startups, applications…"
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <BellIcon className="w-5 h-5 text-slate-600" />
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {adminUser?.display_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-tight">
                {adminUser?.display_name}
              </p>
              <p className="text-xs text-slate-500">
                {ROLE_LABELS[adminUser?.role] || adminUser?.role}
              </p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-surface-border shadow-card-hover z-50 py-1">
              <div className="px-4 py-3 border-b border-surface-border">
                <p className="text-sm font-semibold text-slate-900">{adminUser?.display_name}</p>
                <p className="text-xs text-slate-500 truncate">{adminUser?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <UserCircleIcon className="w-4 h-4" />
                Profile & Settings
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
