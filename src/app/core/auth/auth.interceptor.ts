import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isAuthRequest =
    request.url.includes('/auth/login') || request.url.includes('/auth/register');

  const authenticatedRequest =
    token && !isAuthRequest
      ? request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthRequest) {
        authService.logout();
      }

      return throwError(() => error);
    }),
  );
};
