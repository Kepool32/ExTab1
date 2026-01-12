import { create } from 'zustand';
import { Task, CreateTaskDto, UpdateTaskDto } from '@typings/task.types';
import { taskApi } from '@services/api';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, completed: boolean) => Promise<void>;
  updateTaskData: (id: string, data: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 3,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await taskApi.getAll();
      set({ tasks: Array.isArray(tasks) ? tasks : [], loading: false });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ tasks: [], loading: false });
    }
  },

  createTask: async (data: CreateTaskDto) => {
    try {
      const newTask = await taskApi.create(data);
      if (!newTask) {
        throw new Error('Failed to create task');
      }
      set((state) => ({
        tasks: [newTask, ...(state.tasks || [])],
      }));
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  updateTask: async (id: string, completed: boolean) => {
    try {
      const updatedTask = await taskApi.update(id, { completed });
      set((state) => ({
        tasks: (state.tasks || []).map((task) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  updateTaskData: async (id: string, data: UpdateTaskDto) => {
    try {
      const updatedTask = await taskApi.update(id, data);
      if (!updatedTask) {
        throw new Error('Failed to update task');
      }
      set((state) => ({
        tasks: (state.tasks || []).map((task) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      await taskApi.delete(id);
      set((state) => ({
        tasks: (state.tasks || []).filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setItemsPerPage: (items: number) => {
    set({ itemsPerPage: items, currentPage: 1 });
  },
}));
