import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConnectionService } from './connection.service';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { CryptoService } from '../../../../shared/services/crypto.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FaqDto } from './dto/faq.dto';

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
export class ConnectionComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  supabaseForm!: FormGroup;
  airtableForm!: FormGroup;
  isLoadingSupabaseConnection: boolean = false;
  isLoadingAirtableConnection: boolean = false;
  faq: FaqDto[] = [];

  constructor(
    private connectionService: ConnectionService,
    private toastr: ToastrService,
    private router: Router,
    private cryptoService: CryptoService,
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

    this.getFaq();
  }

  getFaq(): void {
    this.faq = [
      {
        question: 'Why do I need to share my Supabase Table URL and Anon Key?',
        answer:
          'We require your Supabase Table URL and Anon Key to establish a connection between your database and Airtable. This allows us to sync your data seamlessly. Rest assured, we only use these details for the intended purpose of syncing your tables.',
      },
      {
        question: 'Why do I need to provide my Airtable Access Token?',
        answer:
          'Your Airtable Access Token is necessary to authenticate with your Airtable workspace and enable syncing of data. This token gives us access to only the tables you choose to connect, ensuring that we never access or modify unauthorized data.',
      },
      {
        question: 'Is it safe to share my Supabase and Airtable credentials?',
        answer:
          'Absolutely. Security is our top priority. We use industry-standard encryption to store your credentials securely and only access them when syncing your data. Your credentials are never shared with third parties.',
      },
      {
        question:
          'Does sharing my Supabase Anonymous Key make my data vulnerable?',
        answer:
          'No. The Anonymous Key is designed for public access scenarios in Supabase. It has limited permissions, and we strictly adhere to using it within those permissions. We recommend configuring database rules to ensure the right level of access.',
      },
      {
        question: 'Will my data be exposed or shared with others?',
        answer:
          'No. Your data remains yours, and we only process it as needed for syncing between Supabase and Airtable. We never expose or share your data with third parties.',
      },
      {
        question: 'Can I choose which tables to sync?',
        answer:
          'Yes. You have complete control over which Supabase tables you want to sync with Airtable. Our platform will only access the tables you explicitly configure.',
      },
      {
        question: 'How do you protect my credentials?',
        answer:
          'We use advanced security measures like end-to-end encryption to protect your credentials. All sensitive information is securely stored and accessed only when necessary for syncing.',
      },
      {
        question: 'What should I do if I have more questions or concerns?',
        answer:
          'We’re here to help! If you have any questions or concerns, feel free to contact us at [support email/contact page link].',
      },
    ];
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

  async connectSupabase() {
    this.isLoadingSupabaseConnection = true;

    if (!this.supabaseForm.valid) {
      this.isLoadingSupabaseConnection = false;
      this.toastr.error('Please fill all the fields', 'Error!');
      return;
    }

    try {
      this.supabaseForm.value.anonApiKey = await this.cryptoService.encryptData(
        this.supabaseForm.value.anonApiKey,
      );
      this.supabaseForm.value.projectUrl = await this.cryptoService.encryptData(
        this.supabaseForm.value.projectUrl,
      );
    } catch (error) {
      this.isLoadingSupabaseConnection = false;
      this.toastr.error('Error encrypting data', 'Error!');
      return;
    }

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

  async connectAirtable() {
    this.isLoadingAirtableConnection = true;

    if (!this.airtableForm.valid) {
      this.isLoadingAirtableConnection = false;
      this.toastr.error('Please fill all the fields', 'Error!');
      return;
    }

    try {
      this.airtableForm.value.accessToken =
        await this.cryptoService.encryptData(
          this.airtableForm.value.accessToken,
        );
      this.airtableForm.value.baseId = await this.cryptoService.encryptData(
        this.airtableForm.value.baseId,
      );
    } catch (error) {
      this.isLoadingAirtableConnection = false;
      this.toastr.error('Error encrypting data', 'Error!');
      return;
    }

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
