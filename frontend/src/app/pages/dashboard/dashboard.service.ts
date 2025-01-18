import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private resolveApiUrl(version: string, path: string): string {
    return this.apiUrl + '/api/' + version + '/' + path;
  }

  getUserDetails(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.resolveApiUrl('v1', 'user/details'));
  }
}
