import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TaskHistory, TaskHistoryAction } from './schemas/task-history.schema';

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectModel(TaskHistory.name)
    private readonly taskHistoryModel: Model<TaskHistory>,
  ) {}

  async create(
    taskId: number,
    action: TaskHistoryAction,
    data?: Record<string, unknown>,
  ): Promise<TaskHistory> {
    const history = new this.taskHistoryModel({
      taskId,
      action,
      data,
    });

    return history.save();
  }
}
