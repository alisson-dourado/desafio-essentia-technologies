import { Component, inject, output, input, effect } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../models/task';
import { CreateTask } from '../../models/create-task';
import { UpdateTask } from '../../models/update-task';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private readonly formBuilder = inject(FormBuilder);
  
  readonly taskToEdit = input<Task | null>(null);
  readonly saving = input(false);
  readonly taskCreated = output<CreateTask>();
  readonly taskUpdated = output<{
    id: number;
    changes: UpdateTask;
  }>();
  readonly editCancelled = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
  });

  constructor() {
    effect(() => {
      const task = this.taskToEdit();
  
      if (task) {
        this.form.setValue({
          title: task.title,
          description: task.description ?? '',
        });

        return;
      }

      this.form.reset();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
  
    const { title, description } = this.form.getRawValue();
    const task = this.taskToEdit();

    if (task) {
      this.taskUpdated.emit({
        id: task.id,
        changes: {
          title,
          description,
        },
      });
  
      return;
    }
  
    this.taskCreated.emit({
      title,
      description: description || undefined,
    });
  
    this.form.reset();
  }

  cancelEdit(): void {
    this.editCancelled.emit();
  }
}