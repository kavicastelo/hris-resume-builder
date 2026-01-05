import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { NgClass, NgIf } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

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

  constructor(public themeService: ThemeService, private router: Router, private route: ActivatedRoute, private cookieService: AuthService) {
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

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.cookieService.logout();
    this.is_logged_in = false;
    this.router.navigate(['/sign']);
  }
}
