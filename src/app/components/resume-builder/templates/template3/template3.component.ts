import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-template3',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './template3.component.html',
  styleUrl: './template3.component.scss',
  standalone: true
})
export class Template3Component {
  @Input('personalInfo') personalInfo: any = {}
  @Input('certificates') certificates: any[] = []
  @Input('education') education: any[] = []
  @Input('projects') projects: any[] = []
  @Input('skills') skills: any[] =[]
  @Input('experiences') experiences: any[] = []
  @Input('avatar') avatar: any = ''
}
