/**
 * Kanban board component for application pipeline
 */
import React from 'react';
import StatusBadge from './StatusBadge';
import { formatCurrency, calcAge } from '../../utils/formatters';

function KanbanBoard({ stages = [], items = [], loading, onCardClick }) {
  if (loading) {
    return (
      <div className="kanban-scroll flex gap-4 pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="kanban-column">
            <div className="bg-slate-100 rounded-xl p-3 h-64 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="kanban-scroll flex gap-4 pb-4 -mx-0">
      {stages.map((stage) => {
        const stageItems = items.filter((item) => item.status === stage.id);
        return (
          <div key={stage.id} className="kanban-column shrink-0">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-slate-700">{stage.label}</h3>
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {stageItems.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[200px]">
              {stageItems.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-xs">No applications</p>
                </div>
              ) : (
                stageItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onCardClick?.(item)}
                    className="bg-white border border-surface-border rounded-xl p-3 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-slate-900 text-sm leading-tight truncate">
                        {item.startup_name}
                      </p>
                      {item.priority_flag && (
                        <span className="text-red-500 text-xs ml-1 shrink-0">🔴</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      {item.sector} · {formatCurrency(item.funding_ask)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{calcAge(item.created_at)}</span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
