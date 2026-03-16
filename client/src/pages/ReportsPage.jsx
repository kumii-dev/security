/**
 * Reports module — report types, export functionality
 */
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { reportsService } from '../services/api';
import { exportToCsv, exportToExcel } from '../utils/exportUtils';
import { REPORT_TYPES, EXPORT_FORMATS } from '../constants';
import ErrorState from '../components/ui/ErrorState';
import DataTable from '../components/ui/DataTable';
import { formatDate, formatCurrency } from '../utils/formatters';

const REPORT_CONFIGS = [
  { key: 'capital-raised', label: 'Capital Raised', fetcher: reportsService.getCapitalRaised },
  { key: 'startup-readiness', label: 'Startup Readiness', fetcher: reportsService.getStartupReadiness },
  { key: 'application-conversion', label: 'Application Conversion', fetcher: reportsService.getApplicationConversion },
  { key: 'investor-activity', label: 'Investor Activity', fetcher: reportsService.getInvestorActivity },
  { key: 'impact', label: 'Impact Report', fetcher: reportsService.getImpact },
  { key: 'compliance', label: 'Compliance Report', fetcher: reportsService.getCompliance },
];

function ReportsPage() {
  const [activeReport, setActiveReport] = useState(REPORT_CONFIGS[0]);
  const [exportFormat, setExportFormat] = useState('CSV');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['report', activeReport.key],
    queryFn: activeReport.fetcher,
    keepPreviousData: true,
  });

  const exportMutation = useMutation({
    mutationFn: () => reportsService.exportReport(activeReport.key, exportFormat),
    onSuccess: (res) => {
      // Trigger local download
      if (data?.data) {
        if (exportFormat === 'CSV') exportToCsv(data.data, activeReport.label);
        else if (exportFormat === 'Excel') exportToExcel(data.data, activeReport.label);
      }
      toast.success(`${activeReport.label} exported as ${exportFormat}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const columns = data?.columns?.map((col) => ({
    key: col.key,
    label: col.label,
    sortable: true,
    render: col.type === 'currency' ? (v) => formatCurrency(v) :
            col.type === 'date' ? (v) => formatDate(v) :
            undefined,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
      </div>

      {/* Report selector */}
      <div className="card p-0">
        <div className="flex flex-wrap gap-1 p-3 border-b border-surface-border">
          {REPORT_CONFIGS.map((r) => (
            <button
              key={r.key}
              onClick={() => setActiveReport(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeReport.key === r.key
                  ? 'bg-primary-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Export bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-slate-800">{activeReport.label}</h3>
          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="select py-1.5 w-28"
            >
              {EXPORT_FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <button
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending || isLoading}
              className="btn-primary py-1.5"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState message={error.message} retry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          emptyMessage="No data available for this report."
        />
      )}
    </div>
  );
}

export default ReportsPage;
