import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pin',
    pathMatch: 'full'
  },
  {
    path: 'pin',
    loadComponent: () => import('./components/pin-auth/pin-auth.component').then(m => m.PinAuthComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'adventures',
    loadComponent: () => import('./components/adventure-list/adventure-list.component').then(m => m.AdventureListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'adventures/new',
    loadComponent: () => import('./components/adventure-form/adventure-form.component').then(m => m.AdventureFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'adventures/:id',
    loadComponent: () => import('./components/adventure-detail/adventure-detail.component').then(m => m.AdventureDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'adventures/:id/edit',
    loadComponent: () => import('./components/adventure-form/adventure-form.component').then(m => m.AdventureFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'timeline',
    loadComponent: () => import('./components/timeline/timeline.component').then(m => m.TimelineComponent),
    canActivate: [authGuard]
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

