export type TaskHistoryAction =
  | 'created'
  | 'updated'
  | 'completed'
  | 'reopened'
  | 'deleted';

export interface TaskHistory {
  _id: string;
  taskId: number;
  action: TaskHistoryAction;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}