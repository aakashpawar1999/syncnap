import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
class AuthenticationService {
  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.authService.isAuthenticated().subscribe({
      next: (res: any) => {
        if (res) {
          this.router.createUrlTree(['/dashboard']);
          this.localStorageService.setItem('isAuthenticated', res);
        } else {
          this.router.navigate(['/']);
          this.localStorageService.setItem('isAuthenticated', res);
        }
      },
      error: (error: any) => {
        this.router.navigate(['/']);
        this.localStorageService.setItem('isAuthenticated', false);
      },
    });
  }
}

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  return inject(AuthenticationService).canActivate(next, state);
};
