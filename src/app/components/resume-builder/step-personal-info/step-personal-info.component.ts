import {Component, OnInit} from '@angular/core';
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {FormsModule} from '@angular/forms';
import {AlertsService} from '../../../services/alerts.service';

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

  constructor(private resumeStorage: ResumeStorageService, private alertService: AlertsService) {}

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData.personalInfo) {
      this.personalInfo = savedData.personalInfo;
    }
  }

  saveData(): void {
    if (this.personalInfo.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      this.resumeStorage.saveData('personalInfo', this.personalInfo);
    }
    this.alertService.errorMessage('Please enter a valid email address', 'Error');
  }
}
