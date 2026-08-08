import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskHistoryService } from '../task-history/task-history.service';
import { TaskHistoryAction } from 'src/task-history/schemas/task-history.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly taskHistoryService: TaskHistoryService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);

    // O documento do MongoDB armazena um histórico adicional da tarefa utilizando o ID da tarefa gerado.
    await this.taskHistoryService.create(savedTask.id, 'created', {
      title: savedTask.title,
      description: savedTask.description,
    });

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const currentTask = await this.findOne(id);

    const task = this.tasksRepository.merge(currentTask, updateTaskDto);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const updatedTask = await this.tasksRepository.save(task);

    let action: TaskHistoryAction = 'updated';

    if (
      updateTaskDto.completed !== undefined &&
      updateTaskDto.completed !== currentTask.completed
    ) {
      action = updateTaskDto.completed ? 'completed' : 'reopened';
    }

    // O objeto changes armazena apenas as propriedades que foram alteradas.
    const changes = Object.fromEntries(
      Object.entries(updateTaskDto).filter(([, value]) => value !== undefined),
    );

    await this.taskHistoryService.create(updatedTask.id, action, {
      changes,
    });

    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);

    await this.taskHistoryService.create(task.id, 'deleted', {
      title: task.title,
      description: task.description,
      completed: task.completed,
    });

    await this.tasksRepository.remove(task);
  }
}
