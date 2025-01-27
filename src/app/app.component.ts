import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from './services/theme.service';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, NgOptimizedImage],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'talentboozt_cv_generator';

  constructor(public themeService: ThemeService) {
  }
}
