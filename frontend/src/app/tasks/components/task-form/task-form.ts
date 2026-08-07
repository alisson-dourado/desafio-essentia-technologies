import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateTask } from '../../models/create-task';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private readonly formBuilder = inject(FormBuilder);
  
  readonly taskCreated = output<CreateTask>();

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
  
    const { title, description } = this.form.getRawValue();
  
    this.taskCreated.emit({
      title,
      description: description || undefined,
    });
  
    this.form.reset();
  }
}