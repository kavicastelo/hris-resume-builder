import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-template2',
  imports: [
    NgForOf,
    NgIf
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
  @Input('skills') skills: any[] = []
  @Input('experiences') experiences: any[] = []
  @Input('references') references: any[] = []
  @Input('languages') languages: any[] = []
  @Input('hobbies') hobbies: any[] = []
  @Input('avatar') avatar: any = ''
}
