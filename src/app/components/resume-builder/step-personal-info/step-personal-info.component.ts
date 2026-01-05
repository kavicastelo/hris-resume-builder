import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ResumeStorageService } from '../../../services/resume-storage.service';
import { FormsModule } from '@angular/forms';
import { AlertsService } from '../../../services/alerts.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-step-personal-info',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './step-personal-info.component.html',
  styleUrl: './step-personal-info.component.scss',
  standalone: true
})
export class StepPersonalInfoComponent implements OnInit, OnDestroy {
  personalInfo = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    occupation: '',
    dob: '',
    bio: ''
  };

  saveStatus = 'Saved';
  private modelChanged: Subject<any> = new Subject<any>();
  private subscription: Subscription;

  constructor(private resumeStorage: ResumeStorageService) {
    this.subscription = this.modelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.saveData();
      });
  }

  ngOnInit(): void {
    const savedData = this.resumeStorage.getData();
    if (savedData?.personalInfo) {
      this.personalInfo = { ...this.personalInfo, ...savedData.personalInfo };
    }
  }

  onInputChange() {
    this.saveStatus = 'Saving...';
    this.modelChanged.next(this.personalInfo);
  }

  saveData(): void {
    if (this.isValidEmail(this.personalInfo.email) || this.personalInfo.firstname) {
      this.resumeStorage.saveData('personalInfo', this.personalInfo);
      this.saveStatus = 'Saved';
    } else {
      // Silent fail or update status
      this.saveStatus = 'Incomplete';
    }
  }

  isValidEmail(email: string): boolean {
    if (!email) return true; // Allow empty execution save
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
