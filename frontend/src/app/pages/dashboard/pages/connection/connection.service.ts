import { Injectable } from '@angular/core';
import { SupabaseConnectionDto, AirtableConnectionDto } from './dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../shared/dto';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private resolveApiUrl(version: string, path: string): string {
    return this.apiUrl + '/api/' + version + '/' + path;
  }

  connectSupabase(payload: SupabaseConnectionDto): Observable<any> {
    return this.http.post<ApiResponse>(
      this.resolveApiUrl('v1', `connections/supabase`),
      payload,
    );
  }

  connectAirtable(payload: AirtableConnectionDto): Observable<any> {
    return this.http.post<ApiResponse>(
      this.resolveApiUrl('v1', `connections/airtable`),
      payload,
    );
  }
}
