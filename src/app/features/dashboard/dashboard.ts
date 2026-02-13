import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { catchError, of, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;

  ngOnInit(): void {
    if (!this.user()) {
      this.authService
        .loadProfile()
        .pipe(
          catchError(() => of(null)),
          take(1),
        )
        .subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
