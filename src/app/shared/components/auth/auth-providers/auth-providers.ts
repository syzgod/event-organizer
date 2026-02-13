import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-auth-providers',
  imports: [ButtonModule, DividerModule],
  template: `
    <div class="auth-social">
      <p-button
        label="Continue with Google"
        icon="pi pi-google"
        severity="secondary"
        [outlined]="true"
        [rounded]="true"
        styleClass="w-full"
      />
      <p-button
        label="Continue with GitHub"
        icon="pi pi-github"
        severity="secondary"
        [outlined]="true"
        [rounded]="true"
        styleClass="w-full"
      />
    </div>

    <p-divider align="center">
      <span class="auth-divider-text">{{ dividerText() }}</span>
    </p-divider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthProvidersComponent {
  readonly dividerText = input.required<string>();
}
