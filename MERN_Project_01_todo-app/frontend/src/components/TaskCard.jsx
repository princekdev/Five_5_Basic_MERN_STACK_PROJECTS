import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

const PRIORITY_STYLES = {
  high:   { dot: 'bg-red-400',    badge: 'text-red-600 bg-red-50 border-red-100' },
  medium: { dot: 'bg-amber-400',  badge: 'text-amber-600 bg-amber-50 border-amber-100' },
  low:    { dot: 'bg-emerald-400',badge: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
};

const TaskCard = ({ task, onEdit }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isCompleted = task.status === 'completed';
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  const handleToggle = async () => {
    setIsToggling(true);
    const result = await toggleTask(task._id);
    if (!result.success) toast.error(result.message);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteTask(task._id);
    if (!result.success) {
      toast.error(result.message);
      setIsDeleting(false);
    } else {
      toast.success('Task deleted');
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-paper border transition-all duration-300 hover:shadow-paper-lg animate-slide-up ${
        isCompleted ? 'border-ink-100 opacity-75' : 'border-ink-100 hover:border-dust'
      } ${isDeleting ? 'scale-95 opacity-0' : ''}`}
    >
      {/* Priority bar */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${priority.dot} ml-0`} />

      <div className="p-5 pl-6">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isCompleted
                ? 'bg-sage border-sage text-white'
                : 'border-dust hover:border-ink-400'
            } ${isToggling ? 'opacity-50' : ''}`}
            aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
          >
            {isCompleted && (
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3
                className={`font-sans font-semibold text-base leading-snug transition-all duration-200 ${
                  isCompleted ? 'line-through text-ink-300' : 'text-ink-800'
                }`}
              >
                {task.title}
              </h3>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${priority.badge}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            {task.description && (
              <p className={`mt-1 text-sm leading-relaxed ${isCompleted ? 'text-ink-300 line-through' : 'text-ink-400'}`}>
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-ink-300">
                {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </span>

              {/* Actions - visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-lg text-ink-300 hover:text-ink-700 hover:bg-parchment transition-all"
                  aria-label="Edit task"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-ink-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  aria-label="Delete task"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
