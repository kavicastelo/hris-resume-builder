import {AfterViewInit, Component} from '@angular/core';
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
export class StepPersonalInfoComponent implements AfterViewInit{
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

  ngAfterViewInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData?.personalInfo) {
      this.personalInfo = savedData.personalInfo;
    }
  }

  saveData(): void {
    if (this.isValidEmail(this.personalInfo.email) && this.personalInfo.email && this.personalInfo.firstname) {
      this.resumeStorage.saveData('personalInfo', this.personalInfo);
    } else {
      this.alertService.errorMessage('Please enter a valid email address', 'Error');
    }
  }

  isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
}
