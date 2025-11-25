import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'adventures',
    loadComponent: () => import('./components/adventure-list/adventure-list.component').then(m => m.AdventureListComponent)
  },
  {
    path: 'adventures/new',
    loadComponent: () => import('./components/adventure-form/adventure-form.component').then(m => m.AdventureFormComponent)
  },
  {
    path: 'adventures/:id',
    loadComponent: () => import('./components/adventure-detail/adventure-detail.component').then(m => m.AdventureDetailComponent)
  },
  {
    path: 'adventures/:id/edit',
    loadComponent: () => import('./components/adventure-form/adventure-form.component').then(m => m.AdventureFormComponent)
  },
  {
    path: 'timeline',
    loadComponent: () => import('./components/timeline/timeline.component').then(m => m.TimelineComponent)
  },
  // Legacy routes for backward compatibility
  {
    path: 'tasks',
    redirectTo: '/adventures',
    pathMatch: 'full'
  },
  {
    path: 'signalr-poc',
    loadComponent: () => import('./components/signalr-poc/signalr-poc.component').then(m => m.SignalRPocComponent)
  },
  {
    path: 'pizza',
    loadComponent: () => import('./components/pizza-restaurant/pizza-restaurant.component').then(m => m.PizzaRestaurantComponent)
  }
];

