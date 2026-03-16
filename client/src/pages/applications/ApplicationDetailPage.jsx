/**
 * Application detail page
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { applicationsService } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorState from '../../components/ui/ErrorState';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PIPELINE_STAGES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { adminUser } = useAuth();

  const { data: app, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsService.getById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (payload) => applicationsService.updateStatus(id, payload),
    onSuccess: () => {
      toast.success('Application status updated');
      queryClient.invalidateQueries(['application', id]);
      queryClient.invalidateQueries(['applications']);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!app) return null;

  const canUpdateStatus = ['super_admin', 'funding_manager'].includes(adminUser?.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary py-1.5 px-3">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1">
          <h1 className="page-title">Application #{app.id?.slice(-8)}</h1>
          <p className="text-slate-500 text-sm">{app.startup_name}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Application details */}
        <div className="card lg:col-span-2 space-y-4">
          <h3 className="section-title">Application Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Startup</p>
              <p className="font-medium text-slate-900">{app.startup_name}</p>
            </div>
            <div>
              <p className="text-slate-500">Funding Ask</p>
              <p className="font-semibold text-primary-700">{formatCurrency(app.funding_ask)}</p>
            </div>
            <div>
              <p className="text-slate-500">Sector</p>
              <p className="font-medium text-slate-900">{app.sector}</p>
            </div>
            <div>
              <p className="text-slate-500">Current Stage</p>
              <StatusBadge status={app.status} />
            </div>
            <div>
              <p className="text-slate-500">Submitted</p>
              <p className="font-medium text-slate-900">{formatDate(app.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-500">Last Updated</p>
              <p className="font-medium text-slate-900">{formatDate(app.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Stage update */}
        <div className="card">
          <h3 className="section-title">Update Stage</h3>
          {canUpdateStatus ? (
            <div className="space-y-2">
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => mutation.mutate({ status: stage.id })}
                  disabled={app.status === stage.id || mutation.isPending}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    app.status === stage.id
                      ? 'bg-primary-700 text-white cursor-default'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {stage.label}
                  {app.status === stage.id && (
                    <span className="ml-2 text-xs opacity-70">(current)</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              You don't have permission to update application status.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage;
