import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { ApiResponse } from '../dto/index';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();

  private apiUrl: string = environment.apiUrl;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
    if (isPlatformServer(this.platformId)) {
      this.restoreAuthenticationState();
    }
  }

  private resolveApiUrl(version: string, path: string): string {
    return this.apiUrl + '/api/' + version + '/' + path;
  }

  private restoreAuthenticationState(): void {
    this.isAuthenticated().subscribe({
      next: (res: any) => {
        if (res) {
          this.authenticated.next(res);
        }
      },
      error: (error: any) => {
        this.authenticated.next(false);
      },
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(this.resolveApiUrl('v1', 'auth/validate'));
  }

  login(): Observable<any> {
    return this.http.get<ApiResponse>(this.resolveApiUrl('v1', `auth/login`));
  }

  verifyLogin(code: string): Observable<any> {
    return this.http
      .get<ApiResponse>(this.resolveApiUrl('v1', `auth/callback?code=${code}`))
      .pipe(
        tap(() => {
          this.authenticated.next(true);
          this.localStorageService.setItem('isAuthenticated', true);
        }),
      );
  }

  logout(): Observable<any> {
    const reqJSON = {};
    return this.http
      .get<ApiResponse>(this.resolveApiUrl('v1', 'auth/logout'))
      .pipe(
        tap(() => {
          this.authenticated.next(false);
          this.localStorageService.setItem('isAuthenticated', false);
        }),
      );
  }
}
