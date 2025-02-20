import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ResumeStorageService} from '../../../services/resume-storage.service';

@Component({
  selector: 'app-step-projects',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './step-projects.component.html',
  styleUrl: './step-projects.component.scss',
  standalone: true
})
export class StepProjectsComponent implements OnInit{
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

  constructor(private resumeStorage: ResumeStorageService) {}

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.projects) {
      this.projects = savedData.projects;
    }
  }

  addProject(): void {
    if (this.newProject.name && this.newProject.role) {
      if (this.newProject.present) this.newProject.endDate = 'Present';
      this.projects.push({ ...this.newProject });
      this.saveData();
      this.resetForm();
    }
  }

  removeProject(index: number): void {
    this.projects.splice(index, 1);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('projects', this.projects);
  }

  resetForm(): void {
    this.newProject = { name: '', company: '', startDate: '', endDate: '', description: '', role: '', demo: '', source: '', present: false };
  }
}
