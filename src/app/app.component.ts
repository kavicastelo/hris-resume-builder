import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { NgClass, NgIf } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/common.service';
import { AlertsService } from './services/alerts.service';
import { WindowService } from './services/common/window.service';
import { EmployeeAuthStateService } from './services/cache/employee-auth-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, FooterComponent, NgIf, RouterLink],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'talnova_cv_generator';
  is_logged_in = false;
  employeeId: string | null = null;

  constructor(public themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private authStateService: EmployeeAuthStateService,
    private alertService: AlertsService,
    private windowService: WindowService,
    private commonService: CommonService,
    private cookieService: AuthService) {
  }

  ngOnInit() {
    this.is_logged_in = this.cookieService.isExists();
    this.route.queryParams.subscribe(params => {
      const platform = params['platform'] || 'ResumeBuilder';
      const ref = params['ref'] || '';
      const promo = params['promo'] || '';
      this.cookieService.createPlatform(platform);
      this.cookieService.createReferer(ref);
      this.cookieService.createPromotion(promo);
    });
  }

  async startApp() {
    this.fetchTokensFromLogin();

    this.route.queryParams.subscribe(params => {
      const platform = params['platform'] || 'TrainingPlatform';
      const ref = params['ref'] || '';
      const promo = params['promo'] || '';
      this.cookieService.getPlatform() ? '' : this.cookieService.createPlatform(platform);
      this.cookieService.getReferer() ? '' : this.cookieService.createReferer(ref);
      this.cookieService.getPromotion() ? '' : this.cookieService.createPromotion(promo);
    });

    try {
      await this.autoLogin();
      this.authStateService.initializeUser().subscribe();
    } catch {
      // Do nothing
    }

    this.employeeId = this.cookieService.userID();
    this.themeService.applyTheme();
  }

  autoLogin(): Promise<boolean> {
    const alreadyInitialized = localStorage.getItem('sso-initialized');
    if (alreadyInitialized) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      this.commonService.getSession().subscribe({
        next: (userData) => {
          this.cookieService.createUserID(userData.employeeId);
          this.cookieService.unlock();

          this.commonService.getTokens(userData.email).subscribe((tokens) => {
            localStorage.setItem('sso-initialized', 'true');
            resolve(true);
          });
        },
        error: (err) => {
          this.alertService.successMessage('Claim your free account today!', 'Talent Boozt ✨');
          reject(err);
        }
      });
    });
  }

  fetchTokensFromLogin(): void {
    if (this.windowService.nativeWindow) {
      const rawQuery = window.location.search;
      const params = new URLSearchParams(rawQuery);

      const accessToken = params.get('auth');
      const refreshToken = params.get('reft');

      if (accessToken && refreshToken) {
        // this.cookieService.createAuthToken(accessToken);
        // this.cookieService.createRefreshToken(refreshToken);

        // Clean the URL to prevent re-triggering
        params.delete('auth');
        params.delete('reft');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  login(profile: string, action: string) {
    this.cookieService.login(profile, action);
    this.is_logged_in = true;
  }

  logout() {
    this.commonService.logout().subscribe(() => {
      this.cookieService.logout()
      this.authStateService.clearUser();
      this.alertService.successMessage('You have been logged out successfully.', 'Success');
    });
  }
}
