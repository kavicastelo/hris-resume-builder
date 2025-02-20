import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-certificates',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './step-certificates.component.html',
  styleUrl: './step-certificates.component.scss',
  standalone: true
})
export class StepCertificatesComponent implements OnInit{
  certificates: any[] = [];
  newCertificate = {
    name: '',
    date: '',
    organization: '',
    certificateId: '',
    certificateUrl: ''
  };

  constructor(private resumeStorage: ResumeStorageService) {}

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.certificates) {
      this.certificates = savedData.certificates;
    }
  }

  addCertificate(): void {
    if (this.newCertificate.name && this.newCertificate.date && this.newCertificate.organization && this.newCertificate.certificateId) {
      this.certificates.push({ ...this.newCertificate });
      this.saveData();
      this.resetForm();
    }
  }

  removeCertificate(index: number): void {
    this.certificates.splice(index, 1);
    this.saveData();
  }

  saveData(): void {
    this.resumeStorage.saveData('certificates', this.certificates);
  }

  resetForm(): void {
    this.newCertificate = { organization: '', name: '', date: '', certificateId: '', certificateUrl: '' };
  }
}
