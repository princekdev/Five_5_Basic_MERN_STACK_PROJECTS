import React, { useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { useEffect } from 'react';

const FilterBar = ({ filters, onChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ search: debouncedSearch });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Done' },
  ];

  const priorityOptions = [
    { value: '', label: 'Any' },
    { value: 'high', label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest' },
    { value: 'createdAt', label: 'Oldest' },
    { value: 'title', label: 'A → Z' },
    { value: '-title', label: 'Z → A' },
  ];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink-100 hover:border-dust rounded-xl text-sm text-ink-700 placeholder-ink-300 outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember transition-all font-sans"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(''); onChange({ search: '' }); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap gap-2">
        {/* Status */}
        <div className="flex bg-white border border-ink-100 rounded-xl overflow-hidden">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ status: value })}
              className={`px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                filters.status === value
                  ? 'bg-ink-900 text-cream'
                  : 'text-ink-400 hover:text-ink-700 hover:bg-parchment'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Priority */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ priority: e.target.value })}
          className="px-3 py-1.5 bg-white border border-ink-100 hover:border-dust rounded-xl text-xs font-mono text-ink-500 outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember transition-all cursor-pointer appearance-none"
        >
          {priorityOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="px-3 py-1.5 bg-white border border-ink-100 hover:border-dust rounded-xl text-xs font-mono text-ink-500 outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember transition-all cursor-pointer appearance-none"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
