import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'eventorg-theme';
const DARK_CLASS = 'my-app-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<Theme>(this.resolveInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      if (!this.isBrowser) return;

      const html = document.documentElement;
      if (current === 'dark') {
        html.classList.add(DARK_CLASS);
      } else {
        html.classList.remove(DARK_CLASS);
      }

      localStorage.setItem(STORAGE_KEY, current);
    });
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  private resolveInitialTheme(): Theme {
    if (!this.isBrowser) return 'light';

    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
