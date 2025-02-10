import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Utilities} from '../../shared/utilities/utilities';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {ToastrService} from 'ngx-toastr';
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-support',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit {
  lightboxVisible: boolean = false;
  currentIndex: number = 0;
  utilities = Utilities
  loading: boolean = false;

  images = [
    {
      src: '/imgs/sample-cv-1.webp',
      alt: 'Image 1',
    },
    {
      src: '/imgs/sample-cv-2.webp',
      alt: 'Image 2',
    },
    {
      src: '/imgs/sample-cv-3.webp',
      alt: 'Image 3',
    },
    {
      src: '/imgs/sample-cv-4.webp',
      alt: 'Image 4',
    }
  ]

  cvForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dob: new FormControl(''),
    careerStage: new FormControl('', [Validators.required]),
    jobTitle: new FormControl('', [Validators.required]),
    link: new FormControl(''),
    message: new FormControl('')
  })

  commonError: string = '';

  constructor(private commonService: CommonService, private meta: Meta, private title: Title, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Talentboozt - CV Generator | Support');
    this.meta.addTags([
      { name: 'description', content: 'Get professional resume support from experts with over 13 years of experience for ' +
          'a minimal charge. Enhance your resume with personalized advice and expert editing.' },
      { name: 'keywords', content: 'Professional resume support, Affordable resume help, Expert resume writing, ' +
          'Professional resume services, Resume editing services, Minimal charge resume support, Experienced resume writers, ' +
          'Career support services, Professional CV assistance, Resume consultation' }
    ]);
  }

  openLightbox(index: number): void {
    this.currentIndex = index;
    this.lightboxVisible = true;
  }

  closeLightbox(): void {
    this.lightboxVisible = false;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  sendRequest(): void {
    if (this.cvForm.valid) {
      this.loading = true;
      this.commonError = '';
      this.commonService.sendRequest({
        ...this.cvForm.value
      }).subscribe((res: any) => {
        this.cvForm.reset();
        this.toastr.success('Your CV request has been sent successfully.');
        this.loading = false;
      }, (err: any) => {
        this.toastr.error('Something went wrong. Please try again.');
        this.loading = false;
      });
    } else {
      this.commonError = 'Please fill out all required fields.';
    }
  }
  test() {
    this.toastr.info('Please wait...');
  }
}
