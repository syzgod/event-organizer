import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
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
    { validators: [this.passwordMatchValidator] },
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
          this.submitError.set(this.getErrorMessage(error));
        },
      });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Cannot reach the server right now. Please try again in a moment.';
      }

      if (error.status === 409) {
        return 'That email is already registered. Please sign in instead.';
      }

      if (typeof error.error?.message === 'string') {
        return error.error.message;
      }

      if (Array.isArray(error.error?.message) && error.error.message.length > 0) {
        return error.error.message[0];
      }
    }

    return 'Something went wrong while creating your account. Please try again.';
  }
}
