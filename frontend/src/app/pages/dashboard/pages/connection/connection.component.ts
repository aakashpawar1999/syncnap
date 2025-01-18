import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css',
})
export class ConnectionComponent implements OnInit {
  supabaseForm!: FormGroup;
  airtableForm!: FormGroup;

  constructor(private connectionService: ConnectionService) {}

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

  connectSupabase() {
    // Logic to connect to Supabase
    console.log(
      'Connecting to Supabase with URL:',
      this.supabaseForm.value.connectionName,
      this.supabaseForm.value.projectUrl,
      this.supabaseForm.value.anonApiKey,
    );
    this.connectionService.connectSupabase(this.supabaseForm.value).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  connectAirtable() {
    // Logic to connect to Airtable
    console.log(
      'Connecting to Airtable with API Key:',
      this.airtableForm.value.connectionName,
      this.airtableForm.value.accessToken,
      this.airtableForm.value.baseId,
    );
    this.connectionService.connectAirtable(this.airtableForm.value).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      },
    );
  }
}
