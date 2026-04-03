import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

const INITIAL_FORM = { title: '', description: '', status: 'pending', priority: 'medium' };

const TaskModal = ({ isOpen, onClose, editTask }) => {
  const { createTask, updateTask, isSaving } = useTasks();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm(editTask ? {
        title: editTask.title,
        description: editTask.description || '',
        status: editTask.status,
        priority: editTask.priority,
      } : INITIAL_FORM);
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, editTask]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length > 100) errs.title = 'Title too long';
    if (form.description.length > 500) errs.description = 'Description too long';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = editTask
      ? await updateTask(editTask._id, form)
      : await createTask(form);

    if (result.success) {
      toast.success(editTask ? 'Task updated!' : 'Task created!');
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-cream rounded-3xl shadow-paper-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-ink-100">
          <h2 className="font-sans font-bold text-lg text-ink-800">
            {editTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-ink-300 hover:text-ink-600 hover:bg-parchment transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest mb-1.5">
              Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className={`w-full px-4 py-3 rounded-xl bg-white border text-ink-800 placeholder-ink-300 text-sm font-sans transition-all outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember ${
                errors.title ? 'border-red-300' : 'border-ink-100 hover:border-dust'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add some details..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-ink-800 placeholder-ink-300 text-sm font-sans transition-all outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember resize-none ${
                errors.description ? 'border-red-300' : 'border-ink-100 hover:border-dust'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description
                ? <p className="text-xs text-red-500">{errors.description}</p>
                : <span />}
              <span className="text-xs text-ink-300 font-mono">{form.description.length}/500</span>
            </div>
          </div>

          {/* Priority & Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest mb-1.5">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-ink-100 hover:border-dust text-ink-700 text-sm font-sans outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember transition-all appearance-none cursor-pointer"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ink-400 uppercase tracking-widest mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-ink-100 hover:border-dust text-ink-700 text-sm font-sans outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember transition-all appearance-none cursor-pointer"
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-ink-200 text-ink-500 text-sm font-sans font-medium hover:bg-parchment transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-ink-900 text-cream text-sm font-sans font-medium hover:bg-ember transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                  Saving...
                </>
              ) : editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
