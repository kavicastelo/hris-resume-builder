import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResumeStorageService } from '../../../services/resume-storage.service';
import { NgForOf, NgIf } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-step-certificates',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    DragDropModule
  ],
  templateUrl: './step-certificates.component.html',
  styleUrl: './step-certificates.component.scss',
  standalone: true
})
export class StepCertificatesComponent implements OnInit {
  certificates: any[] = [];
  newCertificate = {
    name: '',
    date: '',
    organization: '',
    certificateId: '',
    certificateUrl: ''
  };

  isModalOpen = false;
  editingIndex = -1;

  constructor(private resumeStorage: ResumeStorageService) { }

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.certificates) {
      this.certificates = savedData.certificates;
    }
  }

  openModal(index: number = -1) {
    this.editingIndex = index;
    if (index > -1) {
      this.newCertificate = { ...this.certificates[index] };
    } else {
      this.resetForm();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  saveCertificate(): void {
    if (this.newCertificate.name && this.newCertificate.organization) {

      if (this.editingIndex > -1) {
        this.certificates[this.editingIndex] = { ...this.newCertificate };
      } else {
        this.certificates.push({ ...this.newCertificate });
      }

      this.saveData();
      this.closeModal();
    }
  }

  removeCertificate(index: number): void {
    if (confirm('Are you sure you want to delete this certificate?')) {
      this.certificates.splice(index, 1);
      this.saveData();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.certificates, event.previousIndex, event.currentIndex);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('certificates', this.certificates);
  }

  resetForm(): void {
    this.newCertificate = { organization: '', name: '', date: '', certificateId: '', certificateUrl: '' };
    this.editingIndex = -1;
  }
}
