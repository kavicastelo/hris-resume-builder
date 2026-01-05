import { Injectable } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { WindowService } from './common/window.service';
import { AlertsService } from './alerts.service';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService,
    private alertService: AlertsService,
    private commonService: CommonService,
    private windowService: WindowService) { }

  public createUserID(token: any) {
    this.cookieService.set('user-token-id', token, { expires: 60 * 60 * 24 * 7, path: '/', sameSite: 'Strict', secure: true });
  }

  createSession(user: any) {
    if (this.windowService.nativeSessionStorage)
      sessionStorage.setItem('access_token', user.access_token);
  }

  public logout() {
    this.cookieService.deleteAll();
    if (this.windowService.nativeSessionStorage)
      sessionStorage.clear();
  }

  public isExists(): boolean {
    let user = this.cookieService.get('user-token-id');
    return user.length !== 0; //user.length === 0?false:true
  }

  public userID() {
    return this.cookieService.get('user-token-id').toString();
  }

  public lock() {
    return this.cookieService.set('locked', 'true');
  }

  public unlock() {
    return this.cookieService.delete('locked');
  }

  public isLocked() {
    let locked = this.cookieService.get('locked');
    return locked.length !== 0;
  }

  public acceptAllCookies() {
    this.cookieService.set('cookies-accepted', 'true', 60 * 60 * 24 * 20);
  }

  public isCookiesAccepted() {
    let cookie = this.cookieService.get('cookies-accepted');
    return cookie.length !== 0;
  }

  public createReferer(referer: string) {
    this.cookieService.set('referer', referer, 60 * 60 * 24 * 30);
  }

  public createPlatform(platform: string) {
    this.cookieService.set('platform', platform, 60 * 60 * 24 * 30);
  }

  public createPromotion(promotion: string) {
    this.cookieService.set('promotion', promotion, 60 * 60 * 24 * 30);
  }

  public getReferer() {
    return this.cookieService.get('referer');
  }

  public getPlatform() {
    return this.cookieService.get('platform');
  }

  public getPromotion() {
    return this.cookieService.get('promotion');
  }

  public createAuthToken(token: string) {
    this.cookieService.set('jwtToken', token, { path: '/', secure: true, sameSite: 'Strict' });
  }

  getAuthToken(): string | null {
    return this.cookieService.get('jwtToken');
  }

  isAuthToken(): boolean {
    return !!this.getAuthToken();
  }

  public createRefreshToken(refreshToken: string) {
    this.cookieService.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
  }

  public getRefreshToken(): string | null {
    return this.cookieService.get('refreshToken');
  }

  public isRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  public redirectToLogin() {
    const referrer = this.getReferer();
    const platform = this.getPlatform();
    const promo = this.getPromotion();
    if (this.windowService.nativeDocument) {
      const aElm: HTMLAnchorElement = document.createElement('a');
      aElm.href = 'https://login.talentboozt.com/login?redirectUri=' + window.location.href + '?&plat=' + platform + '&ref=' + referrer + '&prom=' + promo + '&rb=LEARNER&lv=1';
      aElm.target = '_self';
      aElm.click();
    }
  }

  private initialized = false;

  async initSSO(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      await this.autoLogin();
      this.initialized = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  autoLogin(): Promise<boolean> {
    if (this.windowService.nativeLocalStorage) {
      const alreadyInitialized = localStorage.getItem('sso-initialized');
      if (alreadyInitialized) {
        return Promise.resolve(true);
      }
    }

    return new Promise((resolve, reject) => {
      this.commonService.getSession().subscribe({
        next: (userData) => {
          this.createUserID(userData.employeeId);
          this.unlock();

          if (this.windowService.nativeLocalStorage)
            localStorage.setItem('sso-initialized', 'true');
          resolve(true);
        },
        error: () => {
          this.alertService.successMessage('Claim your free account today!', 'Talent Boozt ✨');
          reject();
        }
      });
    });
  }

  login(profile: string, action: string) {
    const referrer = this.getReferer();
    const platform = this.getPlatform();
    const promo = this.getPromotion();

    if (this.windowService.nativeDocument) {
      const currentUrl = window.location.origin + window.location.pathname + '?';
      const redirectParams = new URLSearchParams({
        plat: platform,
        ref: referrer,
        prom: promo,
        rb: profile === 'cv' ? 'CV' : 'GUEST',
        lv: '1',
      });

      // Pointing to the centralized Talnova SSO Hub
      const baseUrl = `https://login.talentboozt.com/${action}`;
      const finalRedirectUrl = `${baseUrl}?redirectUri=${currentUrl}&${redirectParams.toString()}`;

      window.location.href = finalRedirectUrl;
    }
  }

}
