import {Component, Input} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-template1',
  imports: [
    NgForOf,
    NgStyle,
    NgIf
  ],
  templateUrl: './template1.component.html',
  styleUrl: './template1.component.scss',
  standalone: true
})
export class Template1Component {
  @Input('personalInfo') personalInfo: any = {}
  @Input('certificates') certificates: any[] = []
  @Input('education') education: any[] = []
  @Input('projects') projects: any[] = []
  @Input('skills') skills: any[] =[]
  @Input('experiences') experiences: any[] = []
}
