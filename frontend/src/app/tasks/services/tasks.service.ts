import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task } from '../models/task';
import { CreateTask } from '../models/create-task';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3003/tasks';

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  create(createTask: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, createTask);
  }
}