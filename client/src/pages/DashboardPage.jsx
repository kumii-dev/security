/**
 * Dashboard Overview — KPI cards, charts, alerts, recent activity
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BuildingOffice2Icon, UserGroupIcon, DocumentTextIcon,
  CurrencyDollarIcon, BriefcaseIcon, UsersIcon,
  ArrowTrendingUpIcon, HomeIcon,
} from '@heroicons/react/24/outline';
import KPICard from '../components/ui/KPICard';
import ErrorState from '../components/ui/ErrorState';
import StatusBadge from '../components/ui/StatusBadge';
import { AreaLineChart, BarChartComponent, DonutChart, PipelineFunnel } from '../components/charts/Charts';
import { dashboardService } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

function DashboardPage() {
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardService.getMetrics,
    staleTime: 1000 * 60 * 3,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: dashboardService.getAnalytics,
  });

  const { data: alerts } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: dashboardService.getAlerts,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['dashboard-recent-activity'],
    queryFn: dashboardService.getRecentActivity,
  });

  if (metricsError) {
    return <ErrorState message={metricsError.message} retry={refetchMetrics} />;
  }

  const kpis = [
    { label: 'Total Startups', value: metrics?.total_startups, delta: metrics?.startups_delta, icon: BuildingOffice2Icon, color: 'blue' },
    { label: 'Funding Ready', value: metrics?.funding_ready_startups, delta: metrics?.funding_ready_delta, icon: ArrowTrendingUpIcon, color: 'green' },
    { label: 'Active Investors', value: metrics?.active_investors, delta: metrics?.investors_delta, icon: UserGroupIcon, color: 'purple' },
    { label: 'Applications Submitted', value: metrics?.applications_submitted, delta: metrics?.applications_delta, icon: DocumentTextIcon, color: 'orange' },
    { label: 'Deals in Progress', value: metrics?.deals_in_progress, delta: metrics?.deals_delta, icon: BriefcaseIcon, color: 'yellow' },
    { label: 'Capital Raised', value: formatCurrency(metrics?.capital_raised), delta: metrics?.capital_delta, icon: CurrencyDollarIcon, color: 'green' },
    { label: 'Jobs Created', value: metrics?.jobs_created?.toLocaleString(), delta: metrics?.jobs_delta, icon: UsersIcon, color: 'blue' },
    { label: 'Women-Led Startups', value: metrics?.women_led_startups, delta: metrics?.women_led_delta, icon: UsersIcon, color: 'pink' },
    { label: 'Township / Rural Ventures', value: metrics?.township_ventures, delta: null, icon: HomeIcon, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Kumii Capital — Funding Operations Overview
          </p>
        </div>
        <span className="text-xs text-slate-400">
          Last updated: {formatDate(new Date())}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} loading={metricsLoading} {...kpi} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AreaLineChart
          title="Capital Raised by Month (ZAR)"
          data={analytics?.capital_by_month || []}
          lines={[{ key: 'amount', label: 'Capital Raised', color: '#1d4ed8' }]}
          formatter={(v) => formatCurrency(v, false)}
        />
        <BarChartComponent
          title="Applications by Sector"
          data={analytics?.applications_by_sector || []}
          bars={[{ key: 'count', label: 'Applications', color: '#10b981' }]}
        />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DonutChart
          title="Startups by Province"
          data={analytics?.startups_by_province || []}
        />
        <DonutChart
          title="Readiness Distribution"
          data={analytics?.readiness_distribution || []}
        />
        <PipelineFunnel
          title="Funding Pipeline Funnel"
          data={analytics?.pipeline_funnel || []}
        />
      </div>

      {/* Bottom row — alerts + activity + tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Compliance Alerts */}
        <div className="card">
          <h3 className="section-title">⚠️ Compliance Alerts</h3>
          <div className="space-y-2">
            {alerts?.compliance?.length ? (
              alerts.compliance.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                  <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-amber-400' : 'bg-secondary-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No active alerts</p>
            )}
          </div>
        </div>

        {/* Stalled Deals */}
        <div className="card">
          <h3 className="section-title">🔄 Stalled Deals</h3>
          <div className="space-y-2">
            {analytics?.stalled_deals?.length ? (
              analytics.stalled_deals.slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{deal.startup_name}</p>
                    <p className="text-xs text-slate-500">{deal.days_stalled} days stalled</p>
                  </div>
                  <StatusBadge status={deal.stage} />
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No stalled deals</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="section-title">🕐 Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity?.length ? (
              recentActivity.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 truncate">{item.action_summary}</p>
                    <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
