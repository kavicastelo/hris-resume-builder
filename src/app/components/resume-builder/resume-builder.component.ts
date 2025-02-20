import { Component } from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';
import {StepPersonalInfoComponent} from './step-personal-info/step-personal-info.component';
import {StepWorkExperienceComponent} from './step-work-experience/step-work-experience.component';
import {StepEducationComponent} from './step-education/step-education.component';
import {StepSkillsComponent} from './step-skills/step-skills.component';
import {StepProjectsComponent} from './step-projects/step-projects.component';
import {StepSummaryComponent} from './step-summary/step-summary.component';
import {ResumePreviewComponent} from './resume-preview/resume-preview.component';

@Component({
  selector: 'app-resume-builder',
  imports: [
    NgSwitch,
    NgSwitchCase,
    StepPersonalInfoComponent,
    StepWorkExperienceComponent,
    StepEducationComponent,
    StepSkillsComponent,
    StepProjectsComponent,
    StepSummaryComponent,
    ResumePreviewComponent
  ],
  templateUrl: './resume-builder.component.html',
  styleUrl: './resume-builder.component.scss',
  standalone: true
})
export class ResumeBuilderComponent {
  currentStep = 0;
  steps = [0, 1, 2, 3, 4, 5, 6];

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
