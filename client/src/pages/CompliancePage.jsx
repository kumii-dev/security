/**
 * Compliance dashboard — traffic-light status indicators
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { complianceService } from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import { useState } from 'react';

const STATUS_ICON = {
  compliant: <CheckCircleIcon className="w-5 h-5 text-secondary-600" />,
  needs_attention: <ExclamationCircleIcon className="w-5 h-5 text-amber-500" />,
  critical: <XCircleIcon className="w-5 h-5 text-red-600" />,
};

const COMPLIANCE_CHECKS = ['CIPC Verification', 'Tax Compliance', 'B-BBEE Status', 'KYC Status', 'POPIA Consent'];

const COLUMNS = [
  { key: 'startup_name', label: 'Startup', sortable: true },
  {
    key: 'cipc',
    label: 'CIPC',
    render: (v) => STATUS_ICON[v] || STATUS_ICON.needs_attention,
  },
  {
    key: 'tax',
    label: 'Tax',
    render: (v) => STATUS_ICON[v] || STATUS_ICON.needs_attention,
  },
  {
    key: 'bbbee',
    label: 'B-BBEE',
    render: (v) => STATUS_ICON[v] || STATUS_ICON.needs_attention,
  },
  {
    key: 'kyc',
    label: 'KYC',
    render: (v) => STATUS_ICON[v] || STATUS_ICON.needs_attention,
  },
  {
    key: 'popia',
    label: 'POPIA',
    render: (v) => STATUS_ICON[v] || STATUS_ICON.needs_attention,
  },
  {
    key: 'missing_docs',
    label: 'Missing Docs',
    render: (v) => v > 0
      ? <span className="badge-red">{v} missing</span>
      : <span className="badge-green">Complete</span>,
  },
  {
    key: 'overall_status',
    label: 'Risk Level',
    render: (v) => (
      <span className={`badge ${
        v === 'compliant' ? 'badge-green' :
        v === 'needs_attention' ? 'badge-yellow' :
        'badge-red'
      }`}>
        {v === 'compliant' ? '✅ Compliant' :
         v === 'needs_attention' ? '⚠️ Needs Attention' :
         '🔴 Critical'}
      </span>
    ),
  },
];

function CompliancePage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['compliance-summary'],
    queryFn: complianceService.getSummary,
  });

  const { data: alerts } = useQuery({
    queryKey: ['compliance-alerts'],
    queryFn: complianceService.getAlerts,
  });

  const { data: details, isLoading, error, refetch } = useQuery({
    queryKey: ['compliance-details', filters, page],
    queryFn: () => complianceService.getSummary({ ...filters, page, pageSize: 25 }),
    keepPreviousData: true,
  });

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  const statsCards = [
    { label: 'Fully Compliant', value: summary?.compliant_count, color: 'bg-secondary-50 text-secondary-700 border-secondary-200' },
    { label: 'Needs Attention', value: summary?.needs_attention_count, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Critical Issues', value: summary?.critical_count, color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Expired Documents', value: summary?.expired_docs_count, color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Compliance Dashboard</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-3xl font-bold">{s.value ?? '—'}</p>
            <p className="text-sm mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active alerts */}
      {alerts?.length > 0 && (
        <div className="card border-l-4 border-l-red-500">
          <h3 className="section-title">🚨 Active Compliance Alerts</h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <XCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 text-sm">{alert.title}</p>
                  <p className="text-red-700 text-xs">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance table */}
      <FilterBar
        filters={[
          {
            key: 'overall_status',
            label: 'All Statuses',
            options: [
              { value: 'compliant', label: '✅ Compliant' },
              { value: 'needs_attention', label: '⚠️ Needs Attention' },
              { value: 'critical', label: '🔴 Critical' },
            ],
          },
        ]}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        searchKey="search"
        searchPlaceholder="Search startups…"
      />

      <DataTable
        columns={COLUMNS}
        data={details?.data || []}
        loading={isLoading}
        totalCount={details?.total}
        page={page}
        pageSize={25}
        onPageChange={setPage}
        emptyMessage="No compliance records found."
      />
    </div>
  );
}

export default CompliancePage;
