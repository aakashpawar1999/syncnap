import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
class AuthenticationService {
  constructor(
    private router: Router,
    private readonly authService: AuthService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.authService.isAuthenticated().subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        this.router.navigate(['/']);
      },
    });
  }
}

export const loginGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  return inject(AuthenticationService).canActivate(next, state);
};
