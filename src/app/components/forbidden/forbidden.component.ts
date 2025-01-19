import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  templateUrl: './forbidden.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent {

}
