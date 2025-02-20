import {Component, OnInit} from '@angular/core';
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-summary',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './step-summary.component.html',
  styleUrl: './step-summary.component.scss',
  standalone: true
})
export class StepSummaryComponent implements OnInit {

  personalInfo: any = {};
  certificates: any[] = [];
  education: any[] = [];
  projects: any[] = [];
  skills: any[] = [];
  experiences: any[] = [];

  constructor(private resumeStorage: ResumeStorageService) {
  }

  ngOnInit() {
    const savedData = this.resumeStorage.getData();
    if (savedData){
      this.personalInfo = savedData.personalInfo;
      this.certificates = savedData.certificates;
      this.education = savedData.educations;
      this.projects = savedData.projects;
      this.skills = savedData.skills;
      this.experiences = savedData.workExperiences;
    }
  }

  clearAllData() {
    if (confirm('Are you sure to clear all data?'))
      this.resumeStorage.clearData();
  }
}
