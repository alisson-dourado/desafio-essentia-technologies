import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { Task } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskList } from '../../components/task-list/task-list';
import { CreateTask } from '../../models/create-task';
import { UpdateTask } from '../../models/update-task';

@Component({
  selector: 'app-task-page',
  imports: [TaskForm, TaskList],
  templateUrl: './task-page.html',
  styleUrl: './task-page.scss',
})
export class TaskPage implements OnInit {
  private readonly tasksService = inject(TasksService);

  readonly tasks = signal<Task[]>([]);
  readonly editingTask = signal<Task | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly saving = signal(false);
  readonly processingTaskId = signal<number | null>(null);
  readonly actionError = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.tasksService.findAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks', error);

        this.errorMessage.set('Não foi possível carregar as tarefas.');
        this.loading.set(false);
      },
    });
  }

  createTask(createTask: CreateTask): void {
    this.actionError.set(null);
    this.saving.set(true);

    this.tasksService
      .create(createTask)
      .pipe(
        finalize(() => {
          this.saving.set(false);
        }),
      )
      .subscribe({
        next: (task) => {
          this.tasks.update((tasks) => [...tasks, task]);
        },
        error: (error) => {
          console.error('Error creating task', error);
          this.actionError.set('Não foi possível criar a tarefa.');
        },
      });
  }

  updateCompletion(id: number, completed: boolean): void {
    this.actionError.set(null);
    this.processingTaskId.set(id);

    this.tasksService
      .update(id, { completed })
      .pipe(
        finalize(() => {
          this.processingTaskId.set(null);
        }),
      )
      .subscribe({
        next: (updatedTask) => {
          this.tasks.update((tasks) =>
            tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task,
            ),
          );
        },
        error: (error) => {
          console.error('Error updating task completion', error);
          this.actionError.set('Não foi possível alterar o status da tarefa.');
        },
      });
  }

  deleteTask(id: number): void {
    this.actionError.set(null);
    this.processingTaskId.set(id);

    this.tasksService
      .remove(id)
      .pipe(
        finalize(() => {
          this.processingTaskId.set(null);
        }),
      )
      .subscribe({
        next: () => {
          this.tasks.update((tasks) =>
            tasks.filter((task) => task.id !== id),
          );
        },
        error: (error) => {
          console.error('Error deleting task', error);
          this.actionError.set('Não foi possível excluir a tarefa.');
        },
      });
  }

  startEditing(task: Task): void {
    this.editingTask.set(task);
  }

  updateTask(event: { id: number; changes: UpdateTask }): void {
    this.actionError.set(null);
    this.saving.set(true);

    this.tasksService
      .update(event.id, event.changes)
      .pipe(
        finalize(() => {
          this.saving.set(false);
        }),
      )
      .subscribe({
        next: (updatedTask) => {
          this.tasks.update((tasks) =>
            tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task,
            ),
          );
    
          this.editingTask.set(null);
        },
        error: (error) => {
          console.error('Error updating task', error);
          this.actionError.set('Não foi possível atualizar a tarefa.');
        },
      });
  }
}