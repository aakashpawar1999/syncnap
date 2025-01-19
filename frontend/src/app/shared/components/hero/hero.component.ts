import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  login() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.authService.login().subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              window.location.href = res.data.url;
            } else {
              this.toastr.error(res.message, 'Error!');
            }
          },
          error: (error: any) => {
            if (error.error.statusCode === 403) {
              this.toastr.error(
                'Your session has expired. Please login again.',
                'Error!',
              );
              this.router.navigate(['/']);
            } else {
              this.toastr.error(
                Array.isArray(error.error.message) &&
                  error.error.message.length > 0
                  ? error.error.message[0]
                  : 'Unknown error occurred!',
                'Error!',
              );
            }
          },
          complete: () => {},
        }),
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
