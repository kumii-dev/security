/**
 * Settings page — admin-only system configuration
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsService } from '../services/api';
import ErrorState from '../components/ui/ErrorState';

function SettingsPage() {
  const queryClient = useQueryClient();
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getAll,
  });

  const mutation = useMutation({
    mutationFn: ({ key, value }) => settingsService.update(key, value),
    onSuccess: () => {
      toast.success('Setting updated');
      queryClient.invalidateQueries(['settings']);
      setEditKey(null);
    },
    onError: (err) => toast.error(err.message),
  });

  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="text-xs text-red-500 font-medium">⚠️ Super Admin only — changes are audit-logged</p>
      </div>

      <div className="card">
        <h3 className="section-title">System Configuration</h3>
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {(settings?.data || []).map((setting) => (
              <div key={setting.key} className="py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{setting.key}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Last updated: {setting.updated_at ? new Date(setting.updated_at).toLocaleDateString() : '—'}
                  </p>
                </div>
                {editKey === setting.key ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="input w-48"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button
                      onClick={() => mutation.mutate({ key: setting.key, value: editValue })}
                      className="btn-primary py-1.5"
                    >
                      Save
                    </button>
                    <button onClick={() => setEditKey(null)} className="btn-secondary py-1.5">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono max-w-[200px] truncate">
                      {typeof setting.value_json === 'object'
                        ? JSON.stringify(setting.value_json)
                        : String(setting.value_json)}
                    </code>
                    <button
                      onClick={() => {
                        setEditKey(setting.key);
                        setEditValue(
                          typeof setting.value_json === 'object'
                            ? JSON.stringify(setting.value_json)
                            : String(setting.value_json)
                        );
                      }}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
