import { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from './auth.models';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AuthStorageService } from './auth-storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(AuthStorageService);

  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly authToken = signal<string | null>(this.storage.getToken());
  readonly user = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => Boolean(this.authToken()));

  getToken(): string | null {
    return this.authToken();
  }

  login(payload: LoginPayload, rememberMe: boolean): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload).pipe(
      tap((response) => this.persistAuth(response, rememberMe)),
      map((response) => response.user),
    );
  }

  register(payload: RegisterPayload): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, payload).pipe(
      tap((response) => this.persistAuth(response, true)),
      map((response) => response.user),
    );
  }

  loadProfile(): Observable<AuthUser | null> {
    if (!this.authToken()) {
      this.user.set(null);
      return of(null);
    }

    return this.http.get<AuthUser>(`${this.apiBaseUrl}/auth/me`).pipe(
      tap((profile) => this.user.set(profile)),
      catchError((error: unknown) => {
        this.clearAuthState();
        return throwError(() => error);
      }),
    );
  }

  logout(redirect = true): void {
    this.clearAuthState();

    if (redirect) {
      void this.router.navigate(['/login']);
    }
  }

  private persistAuth(response: AuthResponse, rememberMe: boolean): void {
    this.storage.setToken(response.token, rememberMe);
    this.authToken.set(response.token);
    this.user.set(response.user);
  }

  private clearAuthState(): void {
    this.storage.clearToken();
    this.authToken.set(null);
    this.user.set(null);
  }
}
