import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { SyncMappingDto } from './dto';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  supabaseConnectionList: any = [];
  airtableConnectionList: any = [];
  airtableTableList: any = [];
  mappingList: any = [];
  syncLogList: any = [];
  supabaseTable: string = '';
  airtableTable: string = '';
  airtableDisplayName: string = '';
  supabaseConnectionId: string = '';
  airtableConnectionId: string = '';
  isLoadingAirtableTables: boolean = false;
  isLoadingAddMapping: boolean = false;

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getSupabaseConnections();
    this.getAirtableConnections();
    this.getMappings();
    this.getSyncLogs();
  }

  getSupabaseConnections() {
    this.subscriptions.push(
      this.mainService.getSupabaseConnections().subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.supabaseConnectionList = res.data;
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

  onSupabaseConnectionChange(event: any) {
    this.supabaseConnectionId = event.target.value;
  }

  getAirtableConnections() {
    this.subscriptions.push(
      this.mainService.getAirtableConnections().subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.airtableConnectionList = res.data;
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

  onAirtableConnectionChange(event: any) {
    this.airtableConnectionId = event.target.value;
    this.getAirtableTables(this.airtableConnectionId);
  }

  getAirtableTables(airtableConnectionId: string) {
    this.isLoadingAirtableTables = true;
    this.airtableTableList = [];

    this.subscriptions.push(
      this.mainService.getAirtableTables(airtableConnectionId).subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.airtableTableList = res.data;
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
          this.isLoadingAirtableTables = false;
        },
        complete: () => {
          this.isLoadingAirtableTables = false;
        },
      }),
    );
  }

  onAirtableTableChange(event: any) {
    this.airtableTable = event.target.value;
    this.airtableTableList.forEach((table: any) => {
      if (table.id === this.airtableTable) {
        this.airtableDisplayName = table.name;
      }
    });
  }

  addMapping() {
    this.isLoadingAddMapping = true;

    const payload: SyncMappingDto = {
      supabaseTable: this.supabaseTable,
      airtableTable: this.airtableTable,
      airtableDisplayName: this.airtableDisplayName,
      supabaseConnectionId: this.supabaseConnectionId,
      airtableConnectionId: this.airtableConnectionId,
    };
    this.subscriptions.push(
      this.mainService.addMapping(payload).subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.supabaseTable = '';
            this.airtableTable = '';
            this.airtableDisplayName = '';
            this.supabaseConnectionId = '';
            this.airtableConnectionId = '';
            this.getMappings();
            this.toastr.success(res.message, 'Success!');
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
          this.isLoadingAddMapping = false;
        },
        complete: () => {
          this.isLoadingAddMapping = false;
        },
      }),
    );
  }

  getMappings() {
    this.subscriptions.push(
      this.mainService.getMappings().subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.mappingList = res.data;
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

  syncTable(mappingId: string) {
    this.subscriptions.push(
      this.mainService.syncTable(mappingId).subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.toastr.success(res.message, 'Success!');
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
        complete: () => {
          this.getMappings();
          this.getSyncLogs();
        },
      }),
    );

    setTimeout(() => {
      this.getMappings();
      this.getSyncLogs();
    }, 1000);
  }

  getSyncLogs() {
    this.subscriptions.push(
      this.mainService.getSyncLogs().subscribe({
        next: (res: ApiResponse) => {
          this.syncLogList = res.data;
        },
        error: (error: any) => {
          this.toastr.error(
            Array.isArray(error.error.message) && error.error.message.length > 0
              ? error.error.message[0]
              : 'Unknown error occurred!',
            'Error!',
          );
        },
        complete: () => {},
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
