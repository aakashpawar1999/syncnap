import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ToastrModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  userDetails: any = null;
  pageTitles: string[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.pageTitles = event.url.split('/').filter((page) => page !== '');
      }
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  activeLink(link: string) {
    return this.router.url === link;
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
