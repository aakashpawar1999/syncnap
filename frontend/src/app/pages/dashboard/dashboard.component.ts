import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
export class DashboardComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  userDetails: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

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
