import React, { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';

const EmptyState = ({ hasFilters, onClear }) => (
  <div className="text-center py-16 animate-fade-in">
    <div className="w-16 h-16 bg-parchment rounded-2xl flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-dust" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    {hasFilters ? (
      <>
        <h3 className="font-sans font-semibold text-ink-600 mb-1">No tasks match your filters</h3>
        <p className="text-sm text-ink-400 mb-4">Try adjusting your search or filters</p>
        <button
          onClick={onClear}
          className="text-sm text-ember font-semibold hover:underline"
        >
          Clear filters
        </button>
      </>
    ) : (
      <>
        <h3 className="font-sans font-semibold text-ink-600 mb-1">No tasks yet</h3>
        <p className="text-sm text-ink-400">Create your first task to get started</p>
      </>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, filters, isLoading, fetchTasks, fetchStats, setFilters } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const hasFilters = !!(filters.status || filters.priority || filters.search);

  const loadTasks = useCallback(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ status: '', priority: '', search: '', sort: '-createdAt' });
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditTask(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold font-sans text-ink-800">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-ink-400 mt-0.5">Here's what you have on your plate</p>
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Filters */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-ink-400 uppercase tracking-widest">
              {isLoading ? 'Loading...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-ink-900 text-cream text-xs font-mono font-semibold rounded-xl hover:bg-ember transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-ink-100 p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-parchment flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-parchment rounded-lg w-3/4" />
                    <div className="h-3 bg-parchment rounded-lg w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : tasks.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={handleClearFilters} />
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} />
            ))
          )}
        </div>
      </main>

      <TaskModal isOpen={isModalOpen} onClose={handleModalClose} editTask={editTask} />
    </div>
  );
};

export default Dashboard;
