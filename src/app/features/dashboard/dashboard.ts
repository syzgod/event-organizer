import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;

  constructor() {
    if (!this.user()) {
      this.authService
        .loadProfile()
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
