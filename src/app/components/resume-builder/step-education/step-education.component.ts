import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-education',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './step-education.component.html',
  styleUrl: './step-education.component.scss',
  standalone: true
})
export class StepEducationComponent implements OnInit{
  educations: any[] = [];
  newEducation = {
    degree: '',
    school: '',
    country: '',
    startDate: '',
    endDate: '',
    description: '',
    present: false
  };

  constructor(private resumeStorage: ResumeStorageService) {}

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.educations) {
      this.educations = savedData.educations;
    }
  }

  addEducation(): void {
    if (this.newEducation.school && this.newEducation.degree) {
      if (this.newEducation.present) this.newEducation.endDate = 'Present';
      this.educations.push({ ...this.newEducation });
      this.saveData();
      this.resetForm();
    }
  }

  removeEducation(index: number): void {
    this.educations.splice(index, 1);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('educations', this.educations);
  }

  resetForm(): void {
    this.newEducation = { school: '', degree: '', startDate: '', endDate: '', description: '', country: '', present: false };
  }
}
