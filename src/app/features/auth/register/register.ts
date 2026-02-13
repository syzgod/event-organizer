import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthErrorService } from '../../../core/auth/auth-error.service';
import { AuthPasswordFieldComponent } from '../../../shared/components/auth/auth-password-field/auth-password-field';
import { AuthProvidersComponent } from '../../../shared/components/auth/auth-providers/auth-providers';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthShellComponent } from '../../../shared/components/auth/auth-shell/auth-shell';
import { AuthTextFieldComponent } from '../../../shared/components/auth/auth-text-field/auth-text-field';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { finalize } from 'rxjs';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authErrorService = inject(AuthErrorService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly registerForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    },
    { validators: [passwordMatchValidator] },
  );

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.registerForm.getRawValue();
    if (!fullName || !email || !password) {
      return;
    }

    this.submitError.set(null);
    this.isSubmitting.set(true);

    this.authService
      .register({
        fullName,
        email,
        password,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => {
          this.submitError.set(
            this.authErrorService.getMessage(error, {
              network: 'Cannot reach the server right now. Please try again in a moment.',
              byStatus: {
                409: 'That email is already registered. Please sign in instead.',
              },
              fallback: 'Something went wrong while creating your account. Please try again.',
            }),
          );
        },
      });
  }
}
