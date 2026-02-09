import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing').then((m) => m.LandingComponent),
        title: 'Eventorg — Organize Events with Confidence',
      },
      {
        path: 'pricing',
        loadComponent: () => import('./features/pricing/pricing').then((m) => m.PricingComponent),
        title: 'Pricing — Eventorg',
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
        title: 'Sign In — Eventorg',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((m) => m.RegisterComponent),
        title: 'Sign Up — Eventorg',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
