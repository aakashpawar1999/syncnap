import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastrService, ToastrModule } from 'ngx-toastr';

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
            this.toastr.error(
              error.error.message.length > 0
                ? error.error.message[0]
                : 'Unknown error occurred!',
              'Error!',
            );
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
