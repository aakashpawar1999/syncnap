import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor() {}

  ngOnInit() {
    this.supabaseForm = new FormGroup({
      connectionName: new FormControl('', Validators.required),
      supabaseUrl: new FormControl('', Validators.required),
      supabaseAnonKey: new FormControl('', Validators.required),
    });

    this.airtableForm = new FormGroup({
      connectionName: new FormControl('', Validators.required),
      airtableApiKey: new FormControl('', Validators.required),
      airtableBaseId: new FormControl('', Validators.required),
    });
  }

  connectSupabase() {
    // Logic to connect to Supabase
    console.log(
      'Connecting to Supabase with URL:',
      this.supabaseForm.value.supabaseUrl,
      this.supabaseForm.value.supabaseAnonKey,
    );
  }

  connectAirtable() {
    // Logic to connect to Airtable
    console.log(
      'Connecting to Airtable with API Key:',
      this.airtableForm.value.airtableApiKey,
      this.airtableForm.value.airtableBaseId,
    );
  }
}
