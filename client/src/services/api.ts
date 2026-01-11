import axios, { AxiosError } from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '@typings/task.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.response?.status === 400) {
      return 'Invalid input data';
    }
    if (axiosError.response?.status === 404) {
      return 'Resource not found';
    }
    if (axiosError.response?.status === 500) {
      return 'Server error';
    }
    return axiosError.message || 'Network error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    try {
      const response = await api.get<Task[]>('/tasks');
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(extractErrorMessage(error));
    }
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    try {
      const response = await api.post<Task>('/tasks', data);
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Error creating task:', message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    try {
      const response = await api.put<Task>(`/tasks/${id}`, data);
      if (!response?.data) {
        throw new Error('Invalid response from server');
      }
      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Error updating task:', message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Error deleting task:', message);
      throw new Error(message);
    }
  },
};
