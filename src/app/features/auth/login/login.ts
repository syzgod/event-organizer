import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthErrorService } from '../../../core/auth/auth-error.service';
import { AuthPasswordFieldComponent } from '../../../shared/components/auth/auth-password-field/auth-password-field';
import { AuthProvidersComponent } from '../../../shared/components/auth/auth-providers/auth-providers';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthShellComponent } from '../../../shared/components/auth/auth-shell/auth-shell';
import { AuthTextFieldComponent } from '../../../shared/components/auth/auth-text-field/auth-text-field';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { finalize } from 'rxjs';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    AuthShellComponent,
    AuthProvidersComponent,
    AuthTextFieldComponent,
    AuthPasswordFieldComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authErrorService = inject(AuthErrorService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.getRawValue();
    if (!email || !password) {
      return;
    }

    this.submitError.set(null);
    this.isSubmitting.set(true);

    this.authService
      .login(
        {
          email,
          password,
        },
        Boolean(rememberMe),
      )
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
          void this.router.navigateByUrl(returnUrl);
        },
        error: (error: unknown) => {
          this.submitError.set(
            this.authErrorService.getMessage(error, {
              network: 'Cannot reach the server right now. Please try again in a moment.',
              byStatus: {
                401: 'Invalid email or password.',
              },
              fallback: 'Something went wrong while signing in. Please try again.',
            }),
          );
        },
      });
  }
}
