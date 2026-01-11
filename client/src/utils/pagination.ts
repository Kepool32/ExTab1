import { Task } from '@typings/task.types';

export const filterTasks = (tasks: Task[], searchQuery: string): Task[] => {
  if (!searchQuery.trim()) {
    return tasks;
  }

  const query = searchQuery.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
  );
};

export const paginateTasks = (
  tasks: Task[],
  currentPage: number,
  itemsPerPage: number
): Task[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return tasks.slice(startIndex, endIndex);
};

export const getTotalPages = (tasks: Task[], itemsPerPage: number): number => {
  return Math.ceil(tasks.length / itemsPerPage) || 1;
};
