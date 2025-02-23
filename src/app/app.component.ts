import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ThemeService} from './services/theme.service';
import {NgClass, NgIf} from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, FooterComponent, NgIf],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'talentboozt_cv_generator';
  is_logged_in = false;

  constructor(public themeService: ThemeService, private router: Router, private cookieService: AuthService) {
  }

  ngOnInit() {
    this.is_logged_in = this.cookieService.isExists();
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
