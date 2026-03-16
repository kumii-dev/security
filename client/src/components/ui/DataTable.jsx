/**
 * Reusable data table with sort, pagination, empty/loading states
 */
import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import EmptyState from './EmptyState';

function DataTable({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  totalCount,
  page = 1,
  pageSize = 25,
  onPageChange,
  emptyMessage = 'No records found.',
  rowKey = 'id',
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Client-side sort (server-side pagination overrides this)
  const sortedData = sortField
    ? [...data].sort((a, b) => {
        const aVal = a[sortField] ?? '';
        const bVal = b[sortField] ?? '';
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : null;

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-slate-50 border-b border-surface-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`table-th select-none ${col.sortable ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                  style={{ width: col.width }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col ml-1">
                        <ChevronUpIcon
                          className={`w-3 h-3 -mb-0.5 ${sortField === col.key && sortDir === 'asc' ? 'text-primary-700' : 'text-slate-300'}`}
                        />
                        <ChevronDownIcon
                          className={`w-3 h-3 ${sortField === col.key && sortDir === 'desc' ? 'text-primary-700' : 'text-slate-300'}`}
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="table-td">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={row[rowKey]}
                  className={`table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="table-td">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border bg-white">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({totalCount?.toLocaleString()} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn-secondary py-1 px-2 disabled:opacity-40"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="btn-secondary py-1 px-2 disabled:opacity-40"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
