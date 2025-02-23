import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  imports: [
    RouterLink
  ],
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {

  errorMessage: string = '';

  constructor(private router: Router, private meta: Meta, private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('Talentboozt - CV Generator');
    this.meta.addTags([
      { name: 'description', content: 'Create a professional resume for free with TalentBoozt\'s easy-to-use online ' +
          'resume builder. Customize your resume with our templates and manage your profile effortlessly.' },
      { name: 'keywords', content: 'Free resume builder, Online resume builder, Create resume for free, ' +
          'TalentBoozt resume tool, Easy resume creation, Professional resume builder, Customize resume online, ' +
          'Free resume templates, Online CV builder, TalentBoozt profile management' }
    ]);
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
