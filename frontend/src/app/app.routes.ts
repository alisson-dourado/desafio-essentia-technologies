import { Routes } from '@angular/router';

import { LoginPage } from './auth/pages/login-page/login-page';
import { TaskPage } from './tasks/pages/task-page/task-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: '',
    component: TaskPage,
  },
];
    