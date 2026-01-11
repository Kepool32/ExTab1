import { Router } from 'express';
import { TaskController } from '@controllers/task.controller';
import { validateCreateTask, validateUpdateTask } from '@middleware/validation';
import { validateUUID } from '@middleware/uuid-validation';

const router = Router();

router.get('/tasks', TaskController.getAllTasks);
router.post('/tasks', validateCreateTask, TaskController.createTask);
router.put('/tasks/:id', validateUUID, validateUpdateTask, TaskController.updateTask);
router.delete('/tasks/:id', validateUUID, TaskController.deleteTask);

export default router;
