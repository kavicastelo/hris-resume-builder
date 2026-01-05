import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeStorageService } from '../../../services/resume-storage.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-step-projects',
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './step-projects.component.html',
  styleUrl: './step-projects.component.scss',
  standalone: true
})
export class StepProjectsComponent implements OnInit {
  projects: any[] = [];
  newProject = {
    name: '',
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    demo: '',
    source: '',
    description: '',
    present: false
  };

  isModalOpen = false;
  editingIndex = -1;

  constructor(private resumeStorage: ResumeStorageService) { }

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.projects) {
      this.projects = savedData.projects;
    }
  }

  openModal(index: number = -1) {
    this.editingIndex = index;
    if (index > -1) {
      this.newProject = { ...this.projects[index] };
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveProject(): void {
    if (this.newProject.name && this.newProject.role) {
      if (this.newProject.present) this.newProject.endDate = 'Present';

      if (this.editingIndex > -1) {
        this.projects[this.editingIndex] = { ...this.newProject };
      } else {
        this.projects.push({ ...this.newProject });
      }

      this.saveData();
      this.closeModal();
    }
  }

  removeProject(index: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects.splice(index, 1);
      this.saveData();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('projects', this.projects);
  }

  resetForm(): void {
    this.newProject = { name: '', company: '', startDate: '', endDate: '', description: '', role: '', demo: '', source: '', present: false };
    this.editingIndex = -1;
  }
}
