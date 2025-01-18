import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private resolveApiUrl(version: string, path: string): string {
    return this.apiUrl + '/api/' + version + '/' + path;
  }

  getUserDetails() {
    return this.http.get(this.resolveApiUrl('v1', 'user/details'));
  }
}
