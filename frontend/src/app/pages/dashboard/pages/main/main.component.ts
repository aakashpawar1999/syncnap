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
  supabaseTable: string = '';
  airtableTable: string = '';
  supabaseConnectionId: string = '';
  airtableConnectionId: string = '';

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getSupabaseConnections();
    this.getAirtableConnections();
    this.getMappings();
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
        },
        complete: () => {},
      }),
    );
  }

  onAirtableTableChange(event: any) {
    this.airtableTable = event.target.value;
  }

  addMapping() {
    const payload: SyncMappingDto = {
      supabaseTable: this.supabaseTable,
      airtableTable: this.airtableTable,
      supabaseConnectionId: this.supabaseConnectionId,
      airtableConnectionId: this.airtableConnectionId,
    };
    this.subscriptions.push(
      this.mainService.addMapping(payload).subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.supabaseTable = '';
            this.airtableTable = '';
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
        },
        complete: () => {},
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
