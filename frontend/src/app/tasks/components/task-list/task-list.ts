import { Component, input } from '@angular/core';

import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  readonly tasks = input.required<Task[]>();
}
