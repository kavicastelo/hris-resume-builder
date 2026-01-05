import { Component, OnInit } from '@angular/core';
import { ResumeStorageService } from '../../../services/resume-storage.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-step-work-experience',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    DragDropModule
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

  isModalOpen = false;
  editingIndex = -1;

  constructor(private resumeStorage: ResumeStorageService) { }

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.workExperiences) {
      this.workExperiences = savedData.workExperiences;
    }
  }

  openModal(index: number = -1) {
    this.editingIndex = index;
    if (index > -1) {
      // Edit mode
      this.newExperience = { ...this.workExperiences[index] };
    } else {
      // Add mode
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveExperience(): void {
    if (this.newExperience.organization && this.newExperience.occupation) {
      if (this.newExperience.present) this.newExperience.endDate = 'Present';

      if (this.editingIndex > -1) {
        // Update existing
        this.workExperiences[this.editingIndex] = { ...this.newExperience };
      } else {
        // Add new
        this.workExperiences.push({ ...this.newExperience });
      }

      this.saveData();
      this.closeModal();
    }
  }

  removeExperience(index: number): void {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.workExperiences.splice(index, 1);
      this.saveData();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.workExperiences, event.previousIndex, event.currentIndex);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('workExperiences', this.workExperiences);
  }

  resetForm(): void {
    this.newExperience = { organization: '', occupation: '', startDate: '', endDate: '', description: '', country: '', present: false };
    this.editingIndex = -1;
  }
}
