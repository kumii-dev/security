import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { investorsService } from '../../services/api';
import ErrorState from '../../components/ui/ErrorState';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { formatCurrency, formatDate } from '../../utils/formatters';

function InvestorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: investor, isLoading, error } = useQuery({
    queryKey: ['investor', id],
    queryFn: () => investorsService.getById(id),
    enabled: !!id,
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!investor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary py-1.5 px-3">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="page-title">{investor.fund_name}</h1>
          <p className="text-slate-500 text-sm">{investor.investor_type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card space-y-4">
          <h3 className="section-title">Investor Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-slate-500">Type</p><p className="font-medium">{investor.investor_type}</p></div>
            <div><p className="text-slate-500">Sectors</p><p className="font-medium">{investor.sector_focus?.join(', ')}</p></div>
            <div><p className="text-slate-500">Geography</p><p className="font-medium">{investor.geography?.join(', ')}</p></div>
            <div><p className="text-slate-500">Ticket Size</p><p className="font-medium">{formatCurrency(investor.ticket_size_min)} – {formatCurrency(investor.ticket_size_max)}</p></div>
            <div><p className="text-slate-500">Impact Focus</p><p className="font-medium">{investor.impact_focus ? 'Yes' : 'No'}</p></div>
          </div>
        </div>
        <div className="card space-y-3">
          <h3 className="section-title">Activity Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary-700">{investor.meetings ?? 0}</p>
              <p className="text-xs text-primary-600">Meetings</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-secondary-700">{investor.approvals ?? 0}</p>
              <p className="text-xs text-secondary-600">Approvals</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{investor.rejections ?? 0}</p>
              <p className="text-xs text-red-600">Rejections</p>
            </div>
            <div className="bg-accent-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-accent-700">{investor.active_deals ?? 0}</p>
              <p className="text-xs text-accent-600">Active Deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestorDetailPage;
