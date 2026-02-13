import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-auth-password-field',
  imports: [ReactiveFormsModule, FloatLabelModule, PasswordModule],
  template: `
    <div class="auth-field">
      <p-floatlabel variant="on">
        <p-password
          [id]="id()"
          [formControl]="control()"
          [toggleMask]="toggleMask()"
          [feedback]="feedback()"
          [attr.autocomplete]="autocomplete()"
          styleClass="w-full"
          inputStyleClass="w-full"
          fluid
        />
        <label [for]="id()">{{ label() }}</label>
      </p-floatlabel>

      @if (control().touched) {
        <small class="auth-error">
          @if (control().errors?.['required']) {
            {{ requiredMessage() }}
          } @else if (minLengthMessage() && control().errors?.['minlength']) {
            {{ minLengthMessage() }}
          } @else if (customErrorMessage()) {
            {{ customErrorMessage() }}
          }
        </small>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPasswordFieldComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string | null>>();

  readonly autocomplete = input('current-password');
  readonly requiredMessage = input('Password is required');
  readonly minLengthMessage = input<string | null>(null);
  readonly customErrorMessage = input<string | null>(null);
  readonly feedback = input(false);
  readonly toggleMask = input(true);
}
