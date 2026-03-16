/**
 * Filter bar — sector, province, status dropdowns + search
 */
import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

function FilterBar({ filters = [], values = {}, onChange, searchKey, searchPlaceholder }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      {/* Search */}
      {searchKey && (
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={values[searchKey] || ''}
            onChange={(e) => onChange(searchKey, e.target.value)}
            placeholder={searchPlaceholder || 'Search…'}
            className="pl-9 pr-3 py-2 text-sm border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white w-52"
          />
        </div>
      )}

      <FunnelIcon className="w-4 h-4 text-slate-400 hidden sm:block" />

      {/* Dropdown filters */}
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={values[filter.key] || ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          className="select py-2 w-auto min-w-[140px]"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ))}

      {/* Clear filters */}
      {Object.values(values).some(Boolean) && (
        <button
          onClick={() => {
            const reset = {};
            Object.keys(values).forEach((k) => (reset[k] = ''));
            Object.keys(reset).forEach((k) => onChange(k, ''));
          }}
          className="text-xs text-slate-500 hover:text-slate-800 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;
