import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private cookieService: AuthService) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const initialized = await this.cookieService.initSSO();

    const userId = this.cookieService.userID();

    if (initialized && userId) {
      return true;
    } else {
      this.cookieService.redirectToLogin();
      return false;
    }
  }
}
