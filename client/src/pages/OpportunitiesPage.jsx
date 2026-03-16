/**
 * Opportunities page — funding programs list
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import StatusBadge from '../components/ui/StatusBadge';
import { opportunitiesService } from '../services/api';
import { SECTORS, SA_PROVINCES } from '../constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import ErrorState from '../components/ui/ErrorState';

const COLUMNS = [
  { key: 'name', label: 'Opportunity', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'ticket_size', label: 'Ticket Size', render: (v) => formatCurrency(v) },
  { key: 'sector_focus', label: 'Sectors', render: (v) => Array.isArray(v) ? v.join(', ') : v },
  { key: 'deadline', label: 'Deadline', render: (v) => <span className="text-xs">{formatDate(v)}</span> },
  { key: 'geography', label: 'Geography', render: (v) => Array.isArray(v) ? v.join(', ') : v },
  { key: 'matched_startups', label: 'Matched Startups', sortable: true },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
];

function OpportunitiesPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['opportunities', filters, page],
    queryFn: () => opportunitiesService.getAll({ ...filters, page, pageSize: 25 }),
    keepPreviousData: true,
  });

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Funding Opportunities</h1>
        <p className="text-slate-500 text-sm hidden sm:block">
          {data?.total?.toLocaleString() ?? '…'} opportunities available
        </p>
      </div>

      <FilterBar
        filters={[
          { key: 'type', label: 'All Types', options: ['Grant', 'Equity', 'Debt', 'Blended Finance'] },
          { key: 'sector_focus', label: 'All Sectors', options: SECTORS },
          { key: 'geography', label: 'All Regions', options: SA_PROVINCES },
        ]}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        searchKey="search"
        searchPlaceholder="Search opportunities…"
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data || []}
        loading={isLoading}
        totalCount={data?.total}
        page={page}
        pageSize={25}
        onPageChange={setPage}
        emptyMessage="No opportunities found."
      />
    </div>
  );
}

export default OpportunitiesPage;
