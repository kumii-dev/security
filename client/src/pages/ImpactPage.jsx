/**
 * Impact Metrics page — charts, SDG alignment, top performers
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import KPICard from '../components/ui/KPICard';
import { BarChartComponent, DonutChart, AreaLineChart } from '../components/charts/Charts';
import { impactService } from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import { UsersIcon, BuildingOffice2Icon, ArrowTrendingUpIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

function ImpactPage() {
  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ['impact-metrics'],
    queryFn: impactService.getMetrics,
  });
  const { data: bySector } = useQuery({ queryKey: ['impact-sector'], queryFn: impactService.getBySector });
  const { data: byProvince } = useQuery({ queryKey: ['impact-province'], queryFn: impactService.getByProvince });
  const { data: trends } = useQuery({ queryKey: ['impact-trends'], queryFn: impactService.getTrends });

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  const kpis = [
    { label: 'Jobs Created', value: metrics?.jobs_created?.toLocaleString(), icon: UsersIcon, color: 'blue' },
    { label: 'Women-Led Ventures', value: metrics?.women_led, icon: UsersIcon, color: 'green' },
    { label: 'Youth-Led Ventures', value: metrics?.youth_led, icon: UsersIcon, color: 'orange' },
    { label: 'Township Ventures', value: metrics?.township_ventures, icon: BuildingOffice2Icon, color: 'purple' },
    { label: 'Rural Ventures', value: metrics?.rural_ventures, icon: BuildingOffice2Icon, color: 'yellow' },
    { label: 'Climate / Green', value: metrics?.climate_ventures, icon: GlobeAltIcon, color: 'green' },
    { label: 'Disability-Led', value: metrics?.disability_led, icon: UsersIcon, color: 'blue' },
    { label: 'SDG-Aligned', value: metrics?.sdg_aligned, icon: ArrowTrendingUpIcon, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Impact Metrics</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} loading={isLoading} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChartComponent
          title="Impact by Sector"
          data={bySector || []}
          bars={[{ key: 'jobs', label: 'Jobs', color: '#1d4ed8' }, { key: 'startups', label: 'Startups', color: '#10b981' }]}
        />
        <DonutChart
          title="Impact by Province"
          data={byProvince || []}
        />
      </div>

      <AreaLineChart
        title="Impact Growth Over Time"
        data={trends || []}
        lines={[
          { key: 'jobs', label: 'Jobs Created', color: '#1d4ed8' },
          { key: 'women_led', label: 'Women-Led', color: '#10b981' },
          { key: 'youth_led', label: 'Youth-Led', color: '#f97316' },
        ]}
      />

      {/* Top impact startups */}
      {metrics?.top_performers?.length > 0 && (
        <div className="card">
          <h3 className="section-title">🏆 Top Impact-Performing Startups</h3>
          <div className="space-y-2">
            {metrics.top_performers.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.sector} · {s.province}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-secondary-700">{s.jobs_created} jobs</p>
                  <p className="text-xs text-slate-500">{s.impact_score}% impact score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImpactPage;
