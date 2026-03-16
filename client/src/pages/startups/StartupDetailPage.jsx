/**
 * Startup detail page — full profile, metrics, compliance, audit trail
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { startupsService } from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import ErrorState from '../../components/ui/ErrorState';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { formatCurrency, formatDate } from '../../utils/formatters';

function StartupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: startup, isLoading, error } = useQuery({
    queryKey: ['startup', id],
    queryFn: () => startupsService.getById(id),
    enabled: !!id,
  });

  const { data: readiness } = useQuery({
    queryKey: ['startup-readiness', id],
    queryFn: () => startupsService.getReadiness(id),
    enabled: !!id,
  });

  const { data: matches } = useQuery({
    queryKey: ['startup-matches', id],
    queryFn: () => startupsService.getMatches(id),
    enabled: !!id,
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error.message} />;
  if (!startup) return null;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-secondary py-1.5 px-3">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1">
          <h1 className="page-title">{startup.name}</h1>
          <p className="text-slate-500 text-sm">{startup.sector} · {startup.province}</p>
        </div>
        <StatusBadge status={startup.application_status} />
      </div>

      {/* Company profile + founder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2 space-y-4">
          <h3 className="section-title">Company Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Business Name</p>
              <p className="font-medium text-slate-900">{startup.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Founder</p>
              <p className="font-medium text-slate-900">{startup.founder}</p>
            </div>
            <div>
              <p className="text-slate-500">Sector</p>
              <p className="font-medium text-slate-900">{startup.sector}</p>
            </div>
            <div>
              <p className="text-slate-500">Province</p>
              <p className="font-medium text-slate-900">{startup.province}</p>
            </div>
            <div>
              <p className="text-slate-500">Stage</p>
              <p className="font-medium text-slate-900">{startup.stage}</p>
            </div>
            <div>
              <p className="text-slate-500">Funding Ask</p>
              <p className="font-semibold text-primary-700">{formatCurrency(startup.funding_ask)}</p>
            </div>
            <div>
              <p className="text-slate-500">Founded</p>
              <p className="font-medium text-slate-900">{startup.founded_year}</p>
            </div>
            <div>
              <p className="text-slate-500">Employees</p>
              <p className="font-medium text-slate-900">{startup.employees ?? '—'}</p>
            </div>
          </div>
          {startup.description && (
            <div className="pt-2 border-t border-surface-border">
              <p className="text-slate-500 text-xs mb-1">Description</p>
              <p className="text-sm text-slate-700">{startup.description}</p>
            </div>
          )}
        </div>

        {/* Impact flags */}
        <div className="card space-y-3">
          <h3 className="section-title">Impact Flags</h3>
          {[
            { label: 'Women-Led', value: startup.women_led },
            { label: 'Youth-Led', value: startup.youth_led },
            { label: 'Township Venture', value: startup.township_venture },
            { label: 'Rural Venture', value: startup.rural_venture },
            { label: 'Disability-Led', value: startup.disability_led },
            { label: 'Climate / Green', value: startup.climate_venture },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{label}</span>
              {value ? (
                <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Readiness breakdown */}
      <div className="card">
        <h3 className="section-title">Funding Readiness Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(readiness?.dimensions || []).map((dim) => (
            <div key={dim.label} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={dim.score >= 70 ? '#10b981' : dim.score >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${dim.score} ${100 - dim.score}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
                  {dim.score}%
                </span>
              </div>
              <p className="text-xs text-slate-500">{dim.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
          <p className="text-sm font-semibold text-primary-800">
            Overall Readiness Score: {startup.readiness_score}%
          </p>
        </div>
      </div>

      {/* Investor Matches */}
      {matches?.length > 0 && (
        <div className="card">
          <h3 className="section-title">Investor Matches</h3>
          <div className="space-y-2">
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{match.fund_name}</p>
                  <p className="text-xs text-slate-500">{match.investor_type} · {match.sector_focus?.join(', ')}</p>
                </div>
                <span className="text-sm font-semibold text-secondary-700">
                  {match.match_score}% match
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StartupDetailPage;
