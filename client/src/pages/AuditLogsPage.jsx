/**
 * Audit Logs page — searchable, filterable log viewer
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

function AuditLogsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-logs', filters, page],
    queryFn: () => auditService.getLogs({ ...filters, page, pageSize: 50 }),
    keepPreviousData: true,
  });

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="text-slate-500 text-sm">
            Complete tamper-evident admin activity log
          </p>
        </div>
      </div>

      <FilterBar
        filters={[
          { key: 'action_type', label: 'All Actions', options: AUDIT_ACTION_TYPES },
          { key: 'entity_type', label: 'All Entities', options: ENTITY_TYPES },
          {
            key: 'date_from',
            label: 'Date From',
            options: [], // date handled below
          },
        ]}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        searchKey="admin_search"
        searchPlaceholder="Search by admin email…"
      />

      {/* Date range inputs inline */}
      <div className="flex gap-3 mb-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">From</label>
          <input
            type="date"
            className="input py-1.5"
            value={filters.date_from || ''}
            onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">To</label>
          <input
            type="date"
            className="input py-1.5"
            value={filters.date_to || ''}
            onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
          />
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
    </div>
  );
}

export default AuditLogsPage;
