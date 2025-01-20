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
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/pages/main/main.component').then(
            (c) => c.MainComponent,
          ),
      },
      {
        path: 'connections',
        loadComponent: () =>
          import(
            './pages/dashboard/pages/connection/connection.component'
          ).then((c) => c.ConnectionComponent),
      },
      {
        path: 'sync-logs',
        loadComponent: () =>
          import('./pages/dashboard/pages/sync-log/sync-log.component').then(
            (c) => c.SyncLogComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/pages/setting/setting.component').then(
            (c) => c.SettingComponent,
          ),
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
