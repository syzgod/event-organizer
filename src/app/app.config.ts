import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { EventorgPreset } from './core/theme/eventorg-preset';
import { authInterceptor } from './core/auth/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: EventorgPreset,
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'reset, primeng, app',
          },
        },
      },
    }),
  ],
};
