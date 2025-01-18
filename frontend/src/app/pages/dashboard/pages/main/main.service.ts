import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../shared/dto/api-response.dto';
import { SyncMappingDto } from './dto';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private resolveApiUrl(version: string, path: string): string {
    return this.apiUrl + '/api/' + version + '/' + path;
  }

  getSupabaseConnections(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      this.resolveApiUrl('v1', 'connections/supabase'),
    );
  }

  getAirtableConnections(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      this.resolveApiUrl('v1', 'connections/airtable'),
    );
  }

  getAirtableTables(airtableConnectionId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      this.resolveApiUrl(
        'v1',
        `connections/airtable/tables?airtableConnectionId=${airtableConnectionId}`,
      ),
    );
  }

  addMapping(payload: SyncMappingDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.resolveApiUrl('v1', 'sync-mapping'),
      payload,
    );
  }
}
