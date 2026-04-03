import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  stats: { total: 0, completed: 0, pending: 0 },
  isLoading: false,
  isSaving: false,
  error: null,
  filters: { status: '', priority: '', search: '', sort: '-createdAt' },
  pagination: { page: 1, pages: 1, total: 0 },
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        },
        isLoading: false,
        error: null,
      };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks], isSaving: false };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
        isSaving: false,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isSaving: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/tasks?${params.toString()}`);
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to fetch tasks' });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats');
      dispatch({ type: 'SET_STATS', payload: data.stats });
    } catch {}
  }, []);

  const createTask = useCallback(async (taskData) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const { data } = await api.post('/tasks', taskData);
      dispatch({ type: 'ADD_TASK', payload: data.task });
      fetchStats();
      return { success: true, task: data.task };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  }, [fetchStats]);

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: data.task });
      fetchStats();
      return { success: true, task: data.task };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  }, [fetchStats]);

  const toggleTask = useCallback(async (id) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/toggle`);
      dispatch({ type: 'UPDATE_TASK', payload: data.task });
      fetchStats();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to toggle task' };
    }
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      dispatch({ type: 'DELETE_TASK', payload: id });
      fetchStats();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete task' };
    }
  }, [fetchStats]);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetTasks = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <TaskContext.Provider
      value={{ ...state, fetchTasks, fetchStats, createTask, updateTask, toggleTask, deleteTask, setFilters, resetTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export default TaskContext;
