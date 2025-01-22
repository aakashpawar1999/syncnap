import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { Subscription } from 'rxjs';
import { SyncLogService } from './sync-log.service';

@Component({
  selector: 'app-sync-log',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastrModule],
  templateUrl: './sync-log.component.html',
  styleUrl: './sync-log.component.css',
})
export class SyncLogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  isLoadingSyncLog: boolean = false;
  syncLogList: any = [];

  constructor(
    private syncLogService: SyncLogService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getSyncLogs();
  }

  getSyncLogs() {
    this.isLoadingSyncLog = true;
    this.subscriptions.push(
      this.syncLogService.getSyncLogs().subscribe({
        next: (res: ApiResponse) => {
          this.syncLogList = res.data;
        },
        error: (error: any) => {
          console.log(error, 'error');
          if (error.error.statusCode === 403) {
            this.isLoadingSyncLog = false;
            this.toastr.error(
              'Your session has expired. Please login again.',
              'Error!',
            );
            this.router.navigate(['/']);
          } else {
            this.isLoadingSyncLog = false;
            this.toastr.error(
              Array.isArray(error.error.message) &&
                error.error.message.length > 0
                ? error.error.message[0]
                : 'Unknown error occurred!',
              'Error!',
            );
          }
        },
        complete: () => {
          this.isLoadingSyncLog = false;
        },
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
