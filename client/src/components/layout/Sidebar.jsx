/**
 * Sidebar navigation component
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../constants';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartBarIcon, module: 'dashboard' },
  { to: '/startups', label: 'Startups', icon: BuildingOffice2Icon, module: 'startups' },
  { to: '/applications', label: 'Applications', icon: DocumentTextIcon, module: 'applications' },
  { to: '/investors', label: 'Investors', icon: UserGroupIcon, module: 'investors' },
  { to: '/opportunities', label: 'Opportunities', icon: BriefcaseIcon, module: 'opportunities' },
  { to: '/pipeline', label: 'Deal Pipeline', icon: FunnelIcon, module: 'pipeline' },
  { to: '/impact', label: 'Impact Metrics', icon: ArrowTrendingUpIcon, module: 'impact' },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheckIcon, module: 'compliance' },
  { to: '/reports', label: 'Reports', icon: DocumentChartBarIcon, module: 'reports' },
  { to: '/tasks', label: 'Admin Tasks', icon: ClipboardDocumentListIcon, module: 'tasks' },
  { to: '/audit-logs', label: 'Audit Logs', icon: ClockIcon, module: 'audit-logs' },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon, module: 'settings', adminOnly: true },
];

function Sidebar({ open, onClose }) {
  const { adminUser, hasPermission } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly) return adminUser?.role === 'super_admin';
    return hasPermission(item.module);
  });

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-primary-950 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-primary-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Kumii Admin</p>
            <p className="text-primary-400 text-xs">Funding Operations</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-primary-400 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-300 hover:bg-primary-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-primary-400'}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin user profile footer */}
      {adminUser && (
        <div className="px-4 py-4 border-t border-primary-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {adminUser.display_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{adminUser.display_name}</p>
              <p className="text-primary-400 text-xs truncate">
                {ROLE_LABELS[adminUser.role] || adminUser.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
