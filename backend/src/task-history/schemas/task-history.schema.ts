import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskHistoryDocument = HydratedDocument<TaskHistory>;

export type TaskHistoryAction =
  'created' | 'updated' | 'completed' | 'reopened' | 'deleted';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TaskHistory {
  @Prop({ required: true })
  taskId!: number;

  @Prop({ required: true })
  action!: TaskHistoryAction;

  @Prop({ type: Object })
  data?: Record<string, unknown>;
}

export const TaskHistorySchema = SchemaFactory.createForClass(TaskHistory);
