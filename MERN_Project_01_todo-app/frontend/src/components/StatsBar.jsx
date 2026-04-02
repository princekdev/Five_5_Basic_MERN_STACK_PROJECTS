import React from 'react';
import { useTasks } from '../context/TaskContext';

const StatsBar = () => {
  const { stats } = useTasks();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const items = [
    { label: 'Total', value: stats.total, color: 'text-ink-700' },
    { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
    { label: 'Done', value: stats.completed, color: 'text-sage' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-paper border border-ink-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest">Progress</span>
        <span className="text-xs font-mono font-bold text-ember">{completionRate}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-parchment rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-sage to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {items.map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <div className={`text-2xl font-bold font-sans ${color}`}>{value}</div>
            <div className="text-xs font-mono text-ink-300 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
