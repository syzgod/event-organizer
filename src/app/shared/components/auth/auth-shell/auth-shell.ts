import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <a routerLink="/" class="auth-brand">
              <i class="pi pi-calendar-clock"></i>
              <span>Eventorg</span>
            </a>
            <h1 class="auth-title">{{ title() }}</h1>
            <p class="auth-subtitle">{{ subtitle() }}</p>
          </div>

          <ng-content />

          <p class="auth-footer">
            {{ footerText() }}
            <a [routerLink]="footerLink()" class="auth-footer-link">{{ footerLinkLabel() }}</a>
          </p>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly footerText = input.required<string>();
  readonly footerLinkLabel = input.required<string>();
  readonly footerLink = input.required<string>();
}
