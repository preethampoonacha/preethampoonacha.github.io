import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: 'signalr-poc',
    loadComponent: () => import('./components/signalr-poc/signalr-poc.component').then(m => m.SignalRPocComponent)
  }
];

