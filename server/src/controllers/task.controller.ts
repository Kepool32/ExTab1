import { Request, Response } from 'express';
import { TaskService } from '@services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '@typings/task.types';

const taskService = new TaskService();

export class TaskController {
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.findAll();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error fetching tasks';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const createTaskDto: CreateTaskDto = req.body;
      const task = await taskService.create(createTaskDto);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error creating task';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateTaskDto: UpdateTaskDto = req.body;
      const task = await taskService.update(id, updateTaskDto);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error updating task';
      res.status(500).json({ error: errorMessage });
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await taskService.delete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error deleting task';
      res.status(500).json({ error: errorMessage });
    }
  }
}
