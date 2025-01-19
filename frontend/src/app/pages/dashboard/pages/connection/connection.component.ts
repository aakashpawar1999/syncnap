import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConnectionService } from './connection.service';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule,
  ],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css',
})
export class ConnectionComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  supabaseForm!: FormGroup;
  airtableForm!: FormGroup;
  isLoadingSupabaseConnection: boolean = false;
  isLoadingAirtableConnection: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.supabaseForm = new FormGroup({
      connectionName: new FormControl('', Validators.required),
      projectUrl: new FormControl('', Validators.required),
      anonApiKey: new FormControl('', Validators.required),
    });

    this.airtableForm = new FormGroup({
      connectionName: new FormControl('', Validators.required),
      accessToken: new FormControl('', Validators.required),
      baseId: new FormControl('', Validators.required),
    });
  }

  extractBaseIdFromUrl(): void {
    const input = this.airtableForm.value.baseId;
    const isValidUrl = this.checkIfValidUrl(input);
    if (isValidUrl) {
      const appParts = input
        .split('/')
        .filter((part: string) => part.startsWith('app'));
      this.airtableForm.controls['baseId'].setValue(appParts[0]);
    }
  }

  checkIfValidUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  connectSupabase() {
    this.isLoadingSupabaseConnection = true;

    this.subscriptions.push(
      this.connectionService
        .connectSupabase(this.supabaseForm.value)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.code === 200) {
              this.supabaseForm.reset();
              this.toastr.success(response.message, 'Success!');
            } else {
              this.toastr.error(response.message, 'Error!');
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
            this.isLoadingSupabaseConnection = false;
          },
          complete: () => {
            this.isLoadingSupabaseConnection = false;
          },
        }),
    );
  }

  connectAirtable() {
    this.isLoadingAirtableConnection = true;

    this.subscriptions.push(
      this.connectionService
        .connectAirtable(this.airtableForm.value)
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.code === 200) {
              this.airtableForm.reset();
              this.toastr.success(response.message, 'Success!');
            } else {
              this.toastr.error(response.message, 'Error!');
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
            this.isLoadingAirtableConnection = false;
          },
          complete: () => {
            this.isLoadingAirtableConnection = false;
          },
        }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
