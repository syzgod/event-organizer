import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-auth-text-field',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule],
  template: `
    <div class="auth-field">
      <p-floatlabel variant="on">
        <input
          pInputText
          [id]="id()"
          [formControl]="control()"
          [attr.type]="type()"
          [attr.autocomplete]="autocomplete()"
          class="w-full"
        />
        <label [for]="id()">{{ label() }}</label>
      </p-floatlabel>

      @if (control().touched && control().errors) {
        <small class="auth-error">
          @if (control().errors?.['required']) {
            {{ requiredMessage() }}
          } @else if (emailMessage() && control().errors?.['email']) {
            {{ emailMessage() }}
          } @else if (minLengthMessage() && control().errors?.['minlength']) {
            {{ minLengthMessage() }}
          }
        </small>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthTextFieldComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly control = input.required<FormControl<string | null>>();

  readonly type = input('text');
  readonly autocomplete = input('');
  readonly requiredMessage = input('This field is required');
  readonly emailMessage = input<string | null>(null);
  readonly minLengthMessage = input<string | null>(null);
}
