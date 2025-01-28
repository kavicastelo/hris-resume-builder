import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [],
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  errorMessage: string = '';

  constructor(private router: Router) {
  }

  checkID() {
    this.errorMessage = '';
    const inputElement: HTMLInputElement = document.getElementById('userId') as HTMLInputElement;
    const id = inputElement.value;

    if (id === '') {
      this.errorMessage = 'Please enter your Talentboozt User ID';
    } else {
      const objectIdRegex = /^[a-f\d]{24}$/i;

      const isValidObjectId = (id: string) => objectIdRegex.test(id);

      if (!isValidObjectId(id)) {
        this.errorMessage = 'Please enter a valid Talentboozt User ID';
      } else {
        this.errorMessage = '';
        this.router.navigate(['/resume-builder'], { queryParams: { id: id } });
      }
    }
  }

  openSupport() {
    this.router.navigate(['/support']);
  }
}
