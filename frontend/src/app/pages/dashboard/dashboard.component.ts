import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
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
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  activeLink(link: string) {
    return this.router.url === link;
  }

  getUserDetails() {
    this.subscriptions.push(
      this.dashboardService.getUserDetails().subscribe((res: any) => {
        if (res.code === 200) {
          this.userDetails = res.data;
        }
      }),
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.authService.logout().subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.router.navigate(['/']);
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
