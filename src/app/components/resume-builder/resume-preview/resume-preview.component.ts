import {Component, OnInit} from '@angular/core';
import {Template1Component} from "../templates/template1/template1.component";
import {ResumeStorageService} from '../../../services/resume-storage.service';
import {Template2Component} from '../templates/template2/template2.component';
import {Template3Component} from '../templates/template3/template3.component';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-resume-preview',
  imports: [
    Template1Component,
    Template2Component,
    Template3Component,
    ReactiveFormsModule,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.scss',
  standalone: true
})
export class ResumePreviewComponent implements OnInit{
  personalInfo: any = {};
  certificates: any[] = [];
  education: any[] = [];
  projects: any[] = [];
  skills: any[] = [];
  experiences: any[] = [];

  avatar: any;

  selectedCV = 0;
  resumeForm!: FormGroup;

  locked: boolean = true;

  references: any[] = [];
  newReference = {
    name: '',
    phone: '',
    email: '',
    company: ''
  }
  languages: any[] = [];
  newLanguage = {
    name: '',
    level: 'Full Professional Proficiency'
  }
  hobbies: any[] = [];
  newHobby = {
    name: ''
  }

  hasId: boolean = false;
  hasCookie: boolean = false;
  cookieId: any;

  reloadBtn: boolean = true;

  constructor(private resumeStorage: ResumeStorageService,
              private fb: FormBuilder,
              private cookieService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
    this.resumeForm = this.fb.group({
      personalInfo: [true],
      experiences: [true],
      educations: [true],
      skills: [true],
      projects: [false],
      certificates: [false],
      avatar: [{value: false, disabled: true}],
      cvType: ['0']
    });
  }

  ngOnInit() {
    this.locked = true;
    const savedData = this.resumeStorage.getData();
    if (savedData){
      this.personalInfo = savedData.personalInfo;
      this.certificates = savedData.certificates;
      this.education = savedData.educations;
      this.projects = savedData.projects;
      this.skills = savedData.skills;
      this.experiences = savedData.workExperiences;
      this.avatar = savedData.avatar;

      if (savedData.references) {
        this.references = savedData.references;
      }
      if (savedData.languages) {
        this.languages = savedData.languages;
      }
      if (savedData.hobbies) {
        this.hobbies = savedData.hobbies;
      }

      if (savedData.unlocked){
        this.locked = false;
        this.resumeForm.get('avatar')?.enable();
      }

      if (this.personalInfo?.firstname && this.personalInfo?.email){
        this.reloadBtn = false;
      }
    }

    this.route.queryParamMap.subscribe(params => {
      this.hasId = params.get('id') !== null;
    })

    this.hasCookie = this.cookieService.isExists();
  }

  chooseCV() {
    switch (this.resumeForm.get('cvType')?.value) {
      case '0':
        this.selectedCV = 0;
        break;
      case '1':
        this.selectedCV = 1;
        break;
      case '2':
        this.selectedCV = 2;
        break;
      default:
        this.selectedCV = 0;
        break;
    }
  }

  printCV() {
    if (this.hasId || this.hasCookie) {
      const content = document.getElementById('cv');
      if (content) {
        window.print();
      }
    } else {
      this.router.navigate(['/sign/up']);
    }
  }

  reload(){
    setInterval(()=>{
      window.location.reload();
    }, 200)
  }

  addPersonalInfo(){
    this.router.navigate(['/resume-builder']);
    setInterval(()=>{
      window.location.reload();
    }, 200)
  }

  openSupport() {
    this.router.navigate(['/support']);
  }

  addReference() {
    if (this.newReference.name && this.newReference.phone && this.newReference.email && this.newReference.company) {
      this.references.push({ ...this.newReference });
      this.saveReferenceData();
      this.resetReferenceForm();
    }
  }

  removeReference(index: number): void {
    this.references.splice(index, 1);
    this.saveReferenceData();
  }

  saveReferenceData(): void {
    this.resumeStorage.saveData('references', this.references);
  }

  resetReferenceForm(): void {
    this.newReference = { name: '', phone: '', email: '', company: '' };
  }

  addLanguage() {
    if (this.newLanguage.name && this.newLanguage.level) {
      this.languages.push({ ...this.newLanguage });
      this.saveLanguageData();
      this.resetLanguageForm();
    }
  }

  removeLanguage(index: number): void {
    this.languages.splice(index, 1);
    this.saveLanguageData();
  }

  saveLanguageData(): void {
    this.resumeStorage.saveData('languages', this.languages);
  }

  resetLanguageForm(): void {
    this.newLanguage = { name: '', level: '' };
  }

  addHobby() {
    if (this.newHobby.name) {
      this.hobbies.push({ ...this.newHobby });
      this.saveHobbyData();
      this.resetHobbyForm();
    }
  }

  removeHobby(index: number): void {
    this.hobbies.splice(index, 1);
    this.saveHobbyData();
  }

  saveHobbyData(): void {
    this.resumeStorage.saveData('hobbies', this.hobbies);
  }

  resetHobbyForm(): void {
    this.newHobby = { name: '' };
  }
}
