import { Component, input, output } from '@angular/core';

import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  imports: [],
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
  
  toggleCompleted(task: Task): void {
    this.completionChanged.emit({
      id: task.id,
      completed: !task.completed,
    });
  }

  deleteTask(id: number): void {
    this.taskDeleted.emit(id);
  }
}
