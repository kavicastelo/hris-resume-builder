import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-support',
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {
  lightboxVisible: boolean = false;
  currentIndex: number = 0;

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
}
