import {Component, Input} from '@angular/core';
import {NgForOf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-template2',
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './template2.component.html',
  styleUrl: './template2.component.scss',
  standalone: true
})
export class Template2Component {
  @Input('personalInfo') personalInfo: any = {}
  @Input('certificates') certificates: any[] = []
  @Input('education') education: any[] = []
  @Input('projects') projects: any[] = []
  @Input('skills') skills: any[] =[]
  @Input('experiences') experiences: any[] = []
}
