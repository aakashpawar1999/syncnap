import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainService } from './main.service';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { SyncMappingDto } from './dto';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  supabaseConnectionList: any = [];
  airtableConnectionList: any = [];
  airtableTableList: any = [];
  supabaseTable: string = '';
  airtableTable: string = '';
  supabaseConnectionId: string = '';
  airtableConnectionId: string = '';

  constructor(private mainService: MainService) {}

  ngOnInit() {
    this.getSupabaseConnections();
    this.getAirtableConnections();
  }

  getSupabaseConnections() {
    this.subscriptions.push(
      this.mainService.getSupabaseConnections().subscribe({
        next: (res: ApiResponse) => {
          if (res.code === 200) {
            this.supabaseConnectionList = res.data;
            console.log(this.supabaseConnectionList, 'supabase');
          }
        },
        error: (error: any) => {
          console.error(error);
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
            console.log(this.airtableConnectionList, 'airtable');
          }
        },
        error: (error: any) => {
          console.error(error);
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
            console.log(this.airtableTableList, 'airtable list');
          }
        },
        error: (error: any) => {
          console.error(error);
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
    this.mainService.addMapping(payload).subscribe({
      next: (res: ApiResponse) => {
        if (res.code === 200) {
          console.log(res);
          // this.getSyncMappingList();
        }
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
