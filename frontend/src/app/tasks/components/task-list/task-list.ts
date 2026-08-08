import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Task } from '../../models/task';
import { TaskHistory } from '../../models/task-history.model';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  readonly tasks = input.required<Task[]>();    

  readonly completionChanged = output<{
    id: number;
    completed: boolean;
  }>();

  readonly taskDeleted = output<number>();

  readonly taskEditRequested = output<Task>();

  readonly processingTaskId = input<number | null>(null);

  readonly taskHistoryRequested = output<number>();

  readonly historyTaskId = input<number | null>(null);
  readonly taskHistory = input<TaskHistory[]>([]);
  readonly loadingHistory = input(false);
  readonly historyError = input('');
  
  toggleCompleted(task: Task): void {
    this.completionChanged.emit({
      id: task.id,
      completed: !task.completed,
    });
  }

  deleteTask(id: number): void {
    this.taskDeleted.emit(id);
  }

  editTask(task: Task): void {
    this.taskEditRequested.emit(task);
  }

  requestHistory(taskId: number): void {
    this.taskHistoryRequested.emit(taskId);
  }

  historyActionLabel(action: TaskHistory['action']): string {
    const labels: Record<TaskHistory['action'], string> = {
      created: 'Tarefa criada',
      updated: 'Tarefa atualizada',
      completed: 'Tarefa concluída',
      reopened: 'Tarefa reaberta',
      deleted: 'Tarefa excluída',
    };
  
    return labels[action];
  }

  historyChanges(history: TaskHistory): string[] {
    const changes = history.data?.['changes'];
  
    if (!changes || typeof changes !== 'object') {
      return [];
    }
  
    return Object.entries(changes).map(([field, value]) => {
      const labels: Record<string, string> = {
        title: 'Título',
        description: 'Descrição',
        completed: 'Status',
      };
  
      const label = labels[field] ?? field;
  
      if (field === 'completed') {
        return `${label}: ${value ? 'Concluída' : 'Pendente'}`;
      }
  
      return `${label}: ${String(value ?? '')}`;
    });
  }
}
