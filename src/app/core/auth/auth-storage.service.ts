import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = 'eo_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  setToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }

    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
