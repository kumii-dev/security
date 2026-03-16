/**
 * Startups list page — filterable, searchable table
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorState from '../../components/ui/ErrorState';
import { startupsService } from '../../services/api';
import { SECTORS, SA_PROVINCES, FUNDING_STAGES } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

const COLUMNS = [
  { key: 'name', label: 'Startup', sortable: true },
  { key: 'founder', label: 'Founder', sortable: true },
  { key: 'sector', label: 'Sector', sortable: true },
  { key: 'province', label: 'Province', sortable: true },
  {
    key: 'funding_ask',
    label: 'Funding Ask',
    sortable: true,
    render: (v) => formatCurrency(v),
  },
  {
    key: 'readiness_score',
    label: 'Readiness',
    sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-200 rounded-full h-1.5 w-20">
          <div
            className="h-1.5 rounded-full bg-secondary-500"
            style={{ width: `${Math.min(v, 100)}%` }}
          />
        </div>
        <span className="text-xs text-slate-600">{v}%</span>
      </div>
    ),
  },
  {
    key: 'compliance_score',
    label: 'Compliance',
    sortable: true,
    render: (v) => (
      <span className={`text-xs font-medium ${
        v >= 80 ? 'text-secondary-600' : v >= 50 ? 'text-amber-600' : 'text-red-600'
      }`}>
        {v}%
      </span>
    ),
  },
  {
    key: 'application_status',
    label: 'App Status',
    render: (v) => <StatusBadge status={v} />,
  },
  {
    key: 'last_activity',
    label: 'Last Activity',
    sortable: true,
    render: (v) => <span className="text-slate-500 text-xs">{formatDate(v)}</span>,
  },
];

const FILTERS = [
  { key: 'sector', label: 'All Sectors', options: SECTORS },
  { key: 'province', label: 'All Provinces', options: SA_PROVINCES },
  { key: 'stage', label: 'All Stages', options: FUNDING_STAGES },
  {
    key: 'application_status',
    label: 'Application Status',
    options: ['submitted', 'under_review', 'investor_matched', 'approved', 'funded', 'rejected'],
  },
];

function StartupsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['startups', filters, page],
    queryFn: () => startupsService.getAll({ ...filters, page, pageSize: 25 }),
    keepPreviousData: true,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Startups</h1>
          <p className="text-slate-500 text-sm">
            {data?.total?.toLocaleString() ?? '…'} startups registered
          </p>
        </div>
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={handleFilterChange}
        searchKey="search"
        searchPlaceholder="Search startups, founders…"
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data || []}
        loading={isLoading}
        onRowClick={(row) => navigate(`/startups/${row.id}`)}
        totalCount={data?.total}
        page={page}
        pageSize={25}
        onPageChange={setPage}
        emptyMessage="No startups match your filters."
      />
    </div>
  );
}

export default StartupsPage;
