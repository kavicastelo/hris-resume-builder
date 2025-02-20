import {Component, OnInit} from '@angular/core';
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-step-personal-info',
  imports: [
    FormsModule
  ],
  templateUrl: './step-personal-info.component.html',
  styleUrl: './step-personal-info.component.scss',
  standalone: true
})
export class StepPersonalInfoComponent implements OnInit{
  personalInfo = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    occupation: '',
    dob: '',
    bio: ''
  };

  constructor(private resumeStorage: ResumeStorageService) {}

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.personalInfo) {
      this.personalInfo = savedData.personalInfo;
    }
  }

  saveData(): void {
    this.resumeStorage.saveData('personalInfo', this.personalInfo);
  }
}
