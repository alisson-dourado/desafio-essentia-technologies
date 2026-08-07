import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Task } from '../models/task';
import { CreateTask } from '../models/create-task';
import { UpdateTask } from '../models/update-task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  create(createTask: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, createTask);
  }

  update(id: number, updateTask: UpdateTask): Observable<Task> {
    return this.http.patch<Task>(
      `${this.apiUrl}/${id}`,
      updateTask,
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}