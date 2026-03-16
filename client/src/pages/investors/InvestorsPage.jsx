/**
 * Investors list page
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar';
import ErrorState from '../../components/ui/ErrorState';
import { investorsService } from '../../services/api';
import { SECTORS, SA_PROVINCES, INVESTOR_TYPES } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

const COLUMNS = [
  { key: 'fund_name', label: 'Fund Name', sortable: true },
  { key: 'investor_type', label: 'Type', sortable: true },
  { key: 'sector_focus', label: 'Sector Focus', render: (v) => Array.isArray(v) ? v.join(', ') : v },
  { key: 'geography', label: 'Geography', render: (v) => Array.isArray(v) ? v.join(', ') : v },
  {
    key: 'ticket_size_min',
    label: 'Ticket Size',
    render: (v, row) => `${formatCurrency(v)} – ${formatCurrency(row.ticket_size_max)}`,
  },
  {
    key: 'impact_focus',
    label: 'Impact',
    render: (v) => v ? <span className="badge-green">✓ Impact</span> : <span className="badge-gray">—</span>,
  },
  { key: 'active_deals', label: 'Active Deals', sortable: true },
  { key: 'approvals', label: 'Approvals', sortable: true },
];

const FILTERS = [
  { key: 'investor_type', label: 'All Types', options: INVESTOR_TYPES },
  { key: 'sector_focus', label: 'All Sectors', options: SECTORS },
  { key: 'geography', label: 'All Regions', options: [...SA_PROVINCES, 'Pan-Africa', 'International'] },
  { key: 'impact_focus', label: 'Impact Focus', options: [{ value: 'true', label: 'Impact Only' }] },
];

function InvestorsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['investors', filters, page],
    queryFn: () => investorsService.getAll({ ...filters, page, pageSize: 25 }),
    keepPreviousData: true,
  });

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Investors</h1>
          <p className="text-slate-500 text-sm">
            {data?.total?.toLocaleString() ?? '…'} investors registered
          </p>
        </div>
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        searchKey="search"
        searchPlaceholder="Search investors, funds…"
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data || []}
        loading={isLoading}
        onRowClick={(row) => navigate(`/investors/${row.id}`)}
        totalCount={data?.total}
        page={page}
        pageSize={25}
        onPageChange={setPage}
        emptyMessage="No investors match your filters."
      />
    </div>
  );
}

export default InvestorsPage;
