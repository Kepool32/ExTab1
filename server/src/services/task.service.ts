import { Repository } from 'typeorm';
import { AppDataSource } from '@config/database';
import { Task } from '@models/Task';
import { CreateTaskDto, UpdateTaskDto } from '@typings/task.types';

export class TaskService {
  private taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = AppDataSource.getRepository(Task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: createTaskDto.completed ?? false,
    });
    return await this.taskRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.findOne(id);
    if (!task) {
      return null;
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async delete(id: string): Promise<boolean> {
    const task = await this.findOne(id);
    if (!task) {
      return false;
    }

    await this.taskRepository.remove(task);
    return true;
  }
}
