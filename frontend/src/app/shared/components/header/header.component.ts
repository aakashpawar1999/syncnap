import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { DashboardService } from '../../../pages/dashboard/dashboard.service';
import { ApiResponse } from '../../dto/api-response.dto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastrModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  userDetails: any = null;
  isAuthenticated: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private readonly dashboardService: DashboardService,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.isAuthenticated = this.localStorageService.getItem('isAuthenticated');
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;

    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        const code = params.get('code');
        if (currentUrl.includes('auth/callback') && code) {
          this.verify(code || '');
        } else {
          // this.router.navigate(['/']);
        }
      }),
    );

    if (this.isAuthenticated) {
      this.getUserDetails();
    }
  }

  login() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.authService.login().subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              window.location.href = res.data.url;
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
              this.toastr.success(res.message, 'Success!');
            } else {
              this.toastr.error(res.message, 'Error!');
              this.router.navigate(['/']);
            }
          },
          error: (error: any) => {
            if (error.error.statusCode === 403) {
              this.toastr.error(
                'Your session has expired. Please login again.',
                'Error!',
              );
            } else {
              this.toastr.error(
                Array.isArray(error.error.message) &&
                  error.error.message.length > 0
                  ? error.error.message[0]
                  : 'Unknown error occurred!',
                'Error!',
              );
            }
            this.router.navigate(['/']);
          },
          complete: () => {},
        }),
      );
    }
  }

  getUserDetails() {
    this.subscriptions.push(
      this.dashboardService.getUserDetails().subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.userDetails = res.data;
          } else if (res.code === 401) {
            this.toastr.error(res.message, 'Unauthorized Access!');
            this.logout();
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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.authService.logout().subscribe({
          next: (res: ApiResponse) => {
            if (res.code === 200) {
              this.router.navigate(['/']);
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
