/**
 * Applications module — list view + kanban toggle
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { TableCellsIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorState from '../../components/ui/ErrorState';
import KanbanBoard from '../../components/ui/KanbanBoard';
import { applicationsService } from '../../services/api';
import { SECTORS, PIPELINE_STAGES } from '../../constants';
import { formatCurrency, formatDate, calcAge } from '../../utils/formatters';

const COLUMNS = [
  { key: 'startup_name', label: 'Startup', sortable: true },
  {
    key: 'funding_ask',
    label: 'Funding Ask',
    sortable: true,
    render: (v) => formatCurrency(v),
  },
  { key: 'sector', label: 'Sector', sortable: true },
  { key: 'status', label: 'Stage', render: (v) => <StatusBadge status={v} /> },
  {
    key: 'priority_flag',
    label: 'Priority',
    render: (v) => v ? <span className="badge-red">🔴 High</span> : <span className="badge-gray">Normal</span>,
  },
  {
    key: 'created_at',
    label: 'Age',
    render: (v) => <span className="text-slate-500 text-xs">{calcAge(v)}</span>,
  },
  {
    key: 'updated_at',
    label: 'Last Updated',
    render: (v) => <span className="text-slate-500 text-xs">{formatDate(v)}</span>,
  },
];

const FILTERS = [
  { key: 'sector', label: 'All Sectors', options: SECTORS },
  {
    key: 'status',
    label: 'All Stages',
    options: PIPELINE_STAGES.map((s) => ({ value: s.id, label: s.label })),
  },
  {
    key: 'priority_flag',
    label: 'Priority',
    options: [{ value: 'true', label: 'High Priority Only' }],
  },
];

function ApplicationsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['applications', filters, page],
    queryFn: () => applicationsService.getAll({ ...filters, page, pageSize: 25 }),
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
          <h1 className="page-title">Applications</h1>
          <p className="text-slate-500 text-sm">
            {data?.total?.toLocaleString() ?? '…'} applications total
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 border border-surface-border rounded-lg p-1 bg-white">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <TableCellsIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <ViewColumnsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={handleFilterChange}
        searchKey="search"
        searchPlaceholder="Search applications, startups…"
      />

      {viewMode === 'table' ? (
        <DataTable
          columns={COLUMNS}
          data={data?.data || []}
          loading={isLoading}
          onRowClick={(row) => navigate(`/applications/${row.id}`)}
          totalCount={data?.total}
          page={page}
          pageSize={25}
          onPageChange={setPage}
          emptyMessage="No applications found."
        />
      ) : (
        <KanbanBoard
          stages={PIPELINE_STAGES}
          items={data?.data || []}
          loading={isLoading}
          onCardClick={(item) => navigate(`/applications/${item.id}`)}
        />
      )}
    </div>
  );
}

export default ApplicationsPage;
