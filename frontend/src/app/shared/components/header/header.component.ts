import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.route.queryParamMap.subscribe((params) => {
      const code = params.get('code');
      if (currentUrl.includes('auth/callback') && code) {
        this.verify(code || '');
      } else {
        this.router.navigate(['/']);
      }
    });
  }

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

  verify(code: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (!code) {
        return;
      }

      this.subscriptions.push(
        this.authService.verifyLogin(code).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: (error: any) => {
            console.error(error);
            this.router.navigate(['/']);
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
