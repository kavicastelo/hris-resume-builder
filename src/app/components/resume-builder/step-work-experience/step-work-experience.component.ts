import {Component, OnInit} from '@angular/core';
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-work-experience',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './step-work-experience.component.html',
  styleUrl: './step-work-experience.component.scss',
  standalone: true
})
export class StepWorkExperienceComponent implements OnInit {
  workExperiences: any[] = [];
  newExperience = {
    occupation: '',
    country: '',
    organization: '',
    startDate: '',
    endDate: '',
    description: '',
    present: false
  };

  constructor(private resumeStorage: ResumeStorageService) {}

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.workExperiences) {
      this.workExperiences = savedData.workExperiences;
    }
  }

  addExperience(): void {
    if (this.newExperience.organization && this.newExperience.occupation) {
      if (this.newExperience.present) this.newExperience.endDate = 'Present';
      this.workExperiences.push({ ...this.newExperience });
      this.saveData();
      this.resetForm();
    }
  }

  removeExperience(index: number): void {
    this.workExperiences.splice(index, 1);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('workExperiences', this.workExperiences);
  }

  resetForm(): void {
    this.newExperience = { organization: '', occupation: '', startDate: '', endDate: '', description: '', country: '', present: false };
  }
}
