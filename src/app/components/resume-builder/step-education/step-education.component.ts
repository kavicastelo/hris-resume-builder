import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResumeStorageService } from '../../../services/resume-storage.service';
import { NgForOf, NgIf } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-step-education',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    DragDropModule
  ],
  templateUrl: './step-education.component.html',
  styleUrl: './step-education.component.scss',
  standalone: true
})
export class StepEducationComponent implements OnInit {
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

  isModalOpen = false;
  editingIndex = -1;

  constructor(private resumeStorage: ResumeStorageService) { }

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.educations) {
      this.educations = savedData.educations;
    }
  }

  openModal(index: number = -1) {
    this.editingIndex = index;
    if (index > -1) {
      this.newEducation = { ...this.educations[index] };
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveEducation(): void {
    if (this.newEducation.school && this.newEducation.degree) {
      if (this.newEducation.present) this.newEducation.endDate = 'Present';

      if (this.editingIndex > -1) {
        this.educations[this.editingIndex] = { ...this.newEducation };
      } else {
        this.educations.push({ ...this.newEducation });
      }

      this.saveData();
      this.closeModal();
    }
  }

  removeEducation(index: number): void {
    if (confirm('Are you sure you want to delete this education?')) {
      this.educations.splice(index, 1);
      this.saveData();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.educations, event.previousIndex, event.currentIndex);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('educations', this.educations);
  }

  resetForm(): void {
    this.newEducation = { school: '', degree: '', startDate: '', endDate: '', description: '', country: '', present: false };
    this.editingIndex = -1;
  }
}
