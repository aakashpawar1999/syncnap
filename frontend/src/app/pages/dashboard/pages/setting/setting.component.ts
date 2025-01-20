import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from './setting.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  userDetails: any = null;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private readonly settingService: SettingService,
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.subscriptions.push(
      this.settingService.getUserDetails().subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.userDetails = res.data;
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
