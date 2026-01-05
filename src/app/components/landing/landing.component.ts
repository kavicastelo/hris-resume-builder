import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor(private router: Router, private meta: Meta, private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle('Talnova - CV Generator');
    this.meta.addTags([
      {
        name: 'description', content: 'Create a professional resume for free with Talnova\'s easy-to-use online ' +
          'resume builder. Customize your resume with our templates and manage your profile effortlessly.'
      },
      {
        name: 'keywords', content: 'Free resume builder, Online resume builder, Create resume for free, ' +
          'Talnova resume tool, Easy resume creation, Professional resume builder, Customize resume online, ' +
          'Free resume templates, Online CV builder, Talnova profile management'
      }
    ]);
  }
}
