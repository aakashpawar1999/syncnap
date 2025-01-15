import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (c) => c.LandingComponent,
      ),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(
        (c) => c.LandingComponent,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent,
      ),
  },
  { path: '**', component: PageNotFoundComponent },
];
