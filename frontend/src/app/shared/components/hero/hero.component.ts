import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly authService: AuthService,
  ) {}

  login() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.authService.login().subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              console.log(res, 'res');

              window.location.href = res.data.url;
            }
          },
          error: (error: any) => {
            console.error(error);
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
