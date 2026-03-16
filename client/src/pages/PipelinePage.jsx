/**
 * Pipeline page — same kanban but with full stage management
 */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../components/ui/KanbanBoard';
import FilterBar from '../components/ui/FilterBar';
import { applicationsService } from '../services/api';
import { PIPELINE_STAGES, SECTORS } from '../constants';
import ErrorState from '../components/ui/ErrorState';
import { BarChartComponent } from '../components/charts/Charts';

function PipelinePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pipeline', filters],
    queryFn: () => applicationsService.getAll({ ...filters, pageSize: 200 }),
  });

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  // Build stage counts for summary
  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    label: stage.label,
    count: (data?.data || []).filter((a) => a.status === stage.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Deal Pipeline</h1>
      </div>

      {/* Stage summary bar */}
      <div className="card p-0">
        <div className="flex overflow-x-auto">
          {PIPELINE_STAGES.map((stage, i) => {
            const count = stageCounts[i]?.count || 0;
            return (
              <div key={stage.id} className="flex-1 min-w-[100px] text-center py-4 border-r border-surface-border last:border-r-0">
                <p className="text-xl font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <FilterBar
        filters={[
          { key: 'sector', label: 'All Sectors', options: SECTORS },
          { key: 'priority_flag', label: 'Priority', options: [{ value: 'true', label: 'High Priority' }] },
        ]}
        values={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
        searchKey="search"
        searchPlaceholder="Search pipeline…"
      />

      <KanbanBoard
        stages={PIPELINE_STAGES}
        items={data?.data || []}
        loading={isLoading}
        onCardClick={(item) => navigate(`/applications/${item.id}`)}
      />
    </div>
  );
}

export default PipelinePage;
