import { Component, inject, OnInit, signal } from '@angular/core';

import { Task } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskList } from '../../components/task-list/task-list';
import { CreateTask } from '../../models/create-task';

@Component({
  selector: 'app-task-page',
  imports: [TaskForm, TaskList],
  templateUrl: './task-page.html',
  styleUrl: './task-page.scss',
})
export class TaskPage implements OnInit {
  private readonly tasksService = inject(TasksService);

  readonly tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.tasksService.findAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
      },
      error: (error) => {
        console.error('Error loading tasks', error);
      },
    });
  }

  createTask(createTask: CreateTask): void {
    this.tasksService.create(createTask).subscribe({
      next: (task) => {
        this.tasks.update((tasks) => [...tasks, task]);
      },
      error: (error) => {
        console.error('Error creating task', error);
      },
    });
  }
}