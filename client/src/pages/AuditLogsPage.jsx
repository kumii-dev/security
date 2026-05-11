/**
 * Audit Logs page — tabbed view: Logs | Traffic
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/api';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import ErrorState from '../components/ui/ErrorState';
import { formatDate } from '../utils/formatters';

const AUDIT_ACTION_TYPES = [
  'admin_login', 'admin_logout', 'startup_viewed', 'application_status_changed',
  'report_exported', 'task_created', 'settings_changed', 'compliance_action',
  'role_changed', 'startup_updated', 'investor_viewed',
];

const ENTITY_TYPES = ['startup', 'application', 'investor', 'compliance', 'task', 'settings', 'report'];

const COLUMNS = [
  { key: 'created_at', label: 'Timestamp', sortable: true, render: (v) => <span className="text-xs font-mono text-slate-600">{formatDate(v, true)}</span> },
  { key: 'admin_user_email', label: 'Admin', sortable: true },
  { key: 'action_type', label: 'Action', sortable: true, render: (v) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{v}</span> },
  { key: 'entity_type', label: 'Entity', sortable: true },
  { key: 'entity_id', label: 'Entity ID', render: (v) => <span className="text-xs text-slate-400 font-mono">{v?.slice(-8) || '—'}</span> },
  { key: 'action_summary', label: 'Summary' },
  { key: 'ip_address', label: 'IP Address', render: (v) => <span className="text-xs font-mono text-slate-500">{v || '—'}</span> },
];

// ─── Risk badge ────────────────────────────────────────────────────────────────
function RiskBadge({ score }) {
  const styles = {
    high:   'bg-red-100 text-red-700 border border-red-200',
    medium: 'bg-amber-100 text-amber-700 border border-amber-200',
    low:    'bg-green-100 text-green-700 border border-green-200',
  };
  const labels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${styles[score] || styles.low}`}>
      {labels[score] || '🟢 Low'}
    </span>
  );
}

// ─── Activity bar ──────────────────────────────────────────────────────────────
function ActivityBar({ percent, riskScore }) {
  const colours = { high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-primary-400' };
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${colours[riskScore] || colours.low}`}
        style={{ width: `${Math.max(percent, 2)}%` }}
      />
    </div>
  );
}

// ─── Top IP Addresses card ─────────────────────────────────────────────────────
function TopIpCard({ dateFrom, dateTo }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-traffic', dateFrom, dateTo],
    queryFn: () => auditService.getTrafficStats({ dateFrom, dateTo }),
    staleTime: 60_000,
  });

  const exportCsv = () => {
    if (!data?.topIps?.length) return;
    const header = 'IP Address,Requests,Errors,Error Rate (%),Unique Users,Risk,Top Action,Last Seen,% of Total\n';
    const rows = data.topIps.map((r) =>
      `${r.ip},${r.requestCount},${r.errorCount},${r.errorRate},${r.uniqueUsers},${r.riskScore},${r.topAction},${r.lastSeen},${r.percentOfTotal}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-ips-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  const { topIps = [], totalRequests = 0, uniqueIps = 0, highRiskCount = 0 } = data || {};

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: totalRequests.toLocaleString(), icon: '📡' },
          { label: 'Unique IPs', value: uniqueIps.toLocaleString(), icon: '🌐' },
          { label: 'High-Risk IPs', value: highRiskCount.toLocaleString(), icon: '⚠️', highlight: highRiskCount > 0 },
        ].map(({ label, value, icon, highlight }) => (
          <div key={label} className={`rounded-xl border p-4 ${highlight ? 'bg-red-50 border-red-200' : 'bg-white border-surface-border'}`}>
            <p className="text-xs text-slate-500 mb-1">{icon} {label}</p>
            <p className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* IP table card */}
      <div className="bg-white rounded-xl border border-surface-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <div>
            <h3 className="font-semibold text-slate-900">Top IP Addresses</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sorted by request volume · risk scored automatically</p>
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            ↓ Export CSV
          </button>
        </div>

        {topIps.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No IP data found for this period.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-3 px-5 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <div className="col-span-3">IP Address</div>
              <div className="col-span-1 text-right">Requests</div>
              <div className="col-span-1 text-right">Errors</div>
              <div className="col-span-1 text-right">Err %</div>
              <div className="col-span-1 text-right">Users</div>
              <div className="col-span-2">Risk</div>
              <div className="col-span-3">Activity / Last Seen</div>
            </div>

            {topIps.map((row, idx) => (
              <div
                key={row.ip}
                className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-slate-50 transition-colors ${row.riskScore === 'high' ? 'bg-red-50/40' : ''}`}
              >
                {/* IP + rank */}
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono w-5 shrink-0">#{idx + 1}</span>
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-800">{row.ip}</p>
                    <p className="text-xs text-slate-400 truncate">{row.topAction}</p>
                  </div>
                </div>

                {/* Requests */}
                <div className="col-span-1 text-right">
                  <span className="font-semibold text-slate-700">{row.requestCount.toLocaleString()}</span>
                  <p className="text-xs text-slate-400">{row.percentOfTotal}% total</p>
                </div>

                {/* Errors */}
                <div className="col-span-1 text-right">
                  <span className={`font-semibold ${row.errorCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    {row.errorCount}
                  </span>
                </div>

                {/* Error rate */}
                <div className="col-span-1 text-right">
                  <span className={`text-sm font-medium ${row.errorRate > 20 ? 'text-red-600' : 'text-slate-500'}`}>
                    {row.errorRate}%
                  </span>
                </div>

                {/* Unique users */}
                <div className="col-span-1 text-right">
                  <span className="text-slate-600 font-medium">{row.uniqueUsers}</span>
                </div>

                {/* Risk badge */}
                <div className="col-span-2">
                  <RiskBadge score={row.riskScore} />
                </div>

                {/* Activity bar + last seen */}
                <div className="col-span-3 space-y-1">
                  <ActivityBar percent={row.percentOfTotal} riskScore={row.riskScore} />
                  <p className="text-xs text-slate-400 font-mono">
                    {row.lastSeen ? formatDate(row.lastSeen, true) : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Top Devices card ──────────────────────────────────────────────────────────
const DEVICE_ICONS = { desktop: '🖥️', mobile: '📱', tablet: '📲' };
const BROWSER_ICONS = {
  'Chrome': '🟡', 'Microsoft Edge': '🔵', 'Safari': '🧭',
  'Firefox': '🦊', 'Opera': '🔴', 'Internet Explorer': '⚠️', 'Other': '🌐',
};
const OS_ICONS = {
  'Windows 10/11': '🪟', 'Windows': '🪟', 'macOS': '🍎',
  'iOS': '📱', 'Android': '🤖', 'Linux': '🐧', 'ChromeOS': '🌐', 'Other': '💻',
};

function HorizontalBar({ percent, colour = 'bg-primary-400' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${colour}`}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-500 w-9 text-right">{percent}%</span>
    </div>
  );
}

function DeviceDonut({ desktop, mobile, tablet }) {
  // Simple CSS conic-gradient donut — no extra library needed
  const d = desktop.percent, m = mobile.percent, t = tablet.percent;
  const gradient = `conic-gradient(#7a8567 0% ${d}%, #c5df96 ${d}% ${d + m}%, #94a3b8 ${d + m}% 100%)`;
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
        <div className="w-full h-full rounded-full" style={{ background: gradient }} />
        {/* Centre hole */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <span className="text-lg">💻</span>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-600 shrink-0" />
          <span className="text-slate-700">Desktop</span>
          <span className="ml-auto font-semibold text-slate-900">{desktop.percent}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-300 shrink-0" />
          <span className="text-slate-700">Mobile</span>
          <span className="ml-auto font-semibold text-slate-900">{mobile.percent}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
          <span className="text-slate-700">Tablet</span>
          <span className="ml-auto font-semibold text-slate-900">{tablet.percent}%</span>
        </div>
      </div>
    </div>
  );
}

function RankedList({ items, icons, colourFn }) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.name}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{icons[item.name] || '🔘'}</span>
              <span className="text-sm text-slate-700 font-medium">
                {idx === 0 && <span className="text-xs text-primary-600 font-bold mr-1">#1</span>}
                {item.name}
              </span>
            </div>
            <span className="text-xs text-slate-500">{item.count.toLocaleString()} req</span>
          </div>
          <HorizontalBar percent={item.percent} colour={colourFn(idx)} />
        </div>
      ))}
    </div>
  );
}

function TopDevicesCard({ dateFrom, dateTo }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-devices', dateFrom, dateTo],
    queryFn: () => auditService.getDeviceStats({ dateFrom, dateTo }),
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-slate-100 rounded w-40" />
          {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  const {
    total = 0,
    browsers = [],
    operatingSystems = [],
    deviceTypes = { desktop: { count: 0, percent: 0 }, mobile: { count: 0, percent: 0 }, tablet: { count: 0, percent: 0 } },
  } = data || {};

  const browserColours = ['bg-primary-600', 'bg-primary-400', 'bg-primary-300', 'bg-slate-400', 'bg-slate-300'];
  const osColours      = ['bg-primary-700', 'bg-primary-500', 'bg-primary-300', 'bg-slate-400', 'bg-slate-300'];

  return (
    <div className="bg-white rounded-xl border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Top Devices</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Browser, OS & device breakdown · {total.toLocaleString()} sessions analysed
          </p>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">

        {/* Device type donut */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Device Type</p>
          <DeviceDonut
            desktop={deviceTypes.desktop}
            mobile={deviceTypes.mobile}
            tablet={deviceTypes.tablet}
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['desktop', 'mobile', 'tablet'].map((type) => (
              <div key={type} className="text-center bg-slate-50 rounded-lg p-2">
                <p className="text-lg">{DEVICE_ICONS[type]}</p>
                <p className="text-xs text-slate-500 capitalize">{type}</p>
                <p className="font-bold text-slate-800 text-sm">{deviceTypes[type].count.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top browsers */}
        <div className="pt-4 md:pt-0 md:pl-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Browser</p>
          <RankedList
            items={browsers.slice(0, 5)}
            icons={BROWSER_ICONS}
            colourFn={(i) => browserColours[i] || 'bg-slate-200'}
          />
        </div>

        {/* Top operating systems */}
        <div className="pt-4 md:pt-0 md:pl-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Operating System</p>
          <RankedList
            items={operatingSystems.slice(0, 5)}
            icons={OS_ICONS}
            colourFn={(i) => osColours[i] || 'bg-slate-200'}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
function AuditLogsPage() {
  const [activeTab, setActiveTab] = useState('logs');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-logs', filters, page],
    queryFn: () => auditService.getLogs({ ...filters, page, pageSize: 50 }),
    keepPreviousData: true,
    enabled: activeTab === 'logs',
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="text-slate-500 text-sm">Complete tamper-evident admin activity log</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-surface-border">
        {[
          { key: 'logs', label: '📋 Activity Log' },
          { key: 'traffic', label: '📡 Traffic' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Activity Log tab ── */}
      {activeTab === 'logs' && (
        <>
          {error && <ErrorState message={error.message} retry={refetch} />}
          <FilterBar
            filters={[
              { key: 'action_type', label: 'All Actions', options: AUDIT_ACTION_TYPES },
              { key: 'entity_type', label: 'All Entities', options: ENTITY_TYPES },
            ]}
            values={filters}
            onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
            searchKey="admin_search"
            searchPlaceholder="Search by admin email…"
          />
          <div className="flex gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">From</label>
              <input type="date" className="input py-1.5" value={filters.date_from || ''}
                onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">To</label>
              <input type="date" className="input py-1.5" value={filters.date_to || ''}
                onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))} />
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={data?.data || []}
            loading={isLoading}
            totalCount={data?.total}
            page={page}
            pageSize={50}
            onPageChange={setPage}
            emptyMessage="No audit log entries found."
          />
        </>
      )}

      {/* ── Traffic tab ── */}
      {activeTab === 'traffic' && (
        <>
          {/* Date range filter for traffic */}
          <div className="flex gap-3 mb-5">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">From</label>
              <input type="date" className="input py-1.5" value={filters.date_from || ''}
                onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">To</label>
              <input type="date" className="input py-1.5" value={filters.date_to || ''}
                onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))} />
            </div>
          </div>
          <TopIpCard dateFrom={filters.date_from} dateTo={filters.date_to} />
          <div className="mt-5">
            <TopDevicesCard dateFrom={filters.date_from} dateTo={filters.date_to} />
          </div>
        </>
      )}
    </div>
  );
}

export default AuditLogsPage;
