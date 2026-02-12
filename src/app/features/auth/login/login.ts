import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    FloatLabelModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
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
          this.submitError.set(this.getErrorMessage(error));
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Cannot reach the server right now. Please try again in a moment.';
      }

      if (error.status === 401) {
        return 'Invalid email or password.';
      }

      if (typeof error.error?.message === 'string') {
        return error.error.message;
      }

      if (Array.isArray(error.error?.message) && error.error.message.length > 0) {
        return error.error.message[0];
      }
    }

    return 'Something went wrong while signing in. Please try again.';
  }
}
