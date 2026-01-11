import { Request, Response, NextFunction } from 'express';
import { CreateTaskDto, UpdateTaskDto } from '@typings/task.types';

export const validateCreateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const errors: string[] = [];
    const { title, description, completed } = req.body;

    if (!title || typeof title !== 'string') {
      errors.push('Task title is required');
    } else {
      const trimmedTitle = title.trim();
      if (trimmedTitle.length === 0) {
        errors.push('Task title cannot be empty');
      } else if (trimmedTitle.length > 255) {
        errors.push('Task title cannot exceed 255 characters');
      }
    }

    if (!description || typeof description !== 'string') {
      errors.push('Description is required');
    } else {
      const trimmedDescription = description.trim();
      if (trimmedDescription.length === 0) {
        errors.push('Description cannot be empty');
      } else if (trimmedDescription.length > 1000) {
        errors.push('Description cannot exceed 1000 characters');
      }
    }

    if (completed !== undefined && completed !== null) {
      if (typeof completed !== 'boolean') {
        errors.push('Completed must be a boolean value (true or false)');
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(', ') });
      return;
    }

    const trimmedTitle = (title as string).trim();
    const trimmedDescription = (description as string).trim();

    req.body = {
      title: trimmedTitle,
      description: trimmedDescription,
      completed: completed !== undefined && completed !== null ? Boolean(completed) : false,
    } as CreateTaskDto;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
};

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const errors: string[] = [];
    const { title, description, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string') {
        errors.push('Task title must be a string');
      } else {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length === 0) {
          errors.push('Task title cannot be empty');
        } else if (trimmedTitle.length > 255) {
          errors.push('Task title cannot exceed 255 characters');
        }
      }
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        errors.push('Description must be a string');
      } else {
        const trimmedDescription = description.trim();
        if (trimmedDescription.length === 0) {
          errors.push('Description cannot be empty');
        } else if (trimmedDescription.length > 1000) {
          errors.push('Description cannot exceed 1000 characters');
        }
      }
    }

    if (completed !== undefined && completed !== null) {
      if (typeof completed !== 'boolean') {
        errors.push('Completed must be a boolean value (true or false)');
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(', ') });
      return;
    }

    const updateData: UpdateTaskDto = {};
    if (title !== undefined) {
      const trimmedTitle = (title as string).trim();
      if (trimmedTitle.length > 0) {
        updateData.title = trimmedTitle;
      }
    }
    if (description !== undefined) {
      const trimmedDescription = (description as string).trim();
      if (trimmedDescription.length > 0) {
        updateData.description = trimmedDescription;
      }
    }
    if (completed !== undefined && completed !== null) {
      updateData.completed = Boolean(completed);
    }

    req.body = updateData;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
};
