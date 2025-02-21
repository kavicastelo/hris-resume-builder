import {Component, OnInit} from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';
import {StepPersonalInfoComponent} from './step-personal-info/step-personal-info.component';
import {StepWorkExperienceComponent} from './step-work-experience/step-work-experience.component';
import {StepEducationComponent} from './step-education/step-education.component';
import {StepSkillsComponent} from './step-skills/step-skills.component';
import {StepProjectsComponent} from './step-projects/step-projects.component';
import {StepSummaryComponent} from './step-summary/step-summary.component';
import {ResumePreviewComponent} from './resume-preview/resume-preview.component';
import {StepCertificatesComponent} from './step-certificates/step-certificates.component';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {EmployeeService} from '../../services/employee.service';
import {ResumeStorageService} from '../../services/resume-storage.service';

@Component({
  selector: 'app-resume-builder',
  imports: [
    NgSwitch,
    NgSwitchCase,
    StepPersonalInfoComponent,
    StepWorkExperienceComponent,
    StepEducationComponent,
    StepSkillsComponent,
    StepProjectsComponent,
    StepSummaryComponent,
    ResumePreviewComponent,
    StepCertificatesComponent
  ],
  templateUrl: './resume-builder.component.html',
  styleUrl: './resume-builder.component.scss',
  standalone: true
})
export class ResumeBuilderComponent implements OnInit{
  currentStep = 0;
  steps = [0, 1, 2, 3, 4, 5, 6, 7];

  employeeId: any;
  employee: any;

  personalInfo = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    occupation: '',
    dob: '',
    bio: ''
  };
  certificates: any[] = [];
  education: any[] = [];
  projects: any[] = [];
  skills: any[] = [];
  experiences: any[] = [];
  avatar: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private cookieService: AuthService,
              private resumeStorage: ResumeStorageService,
              private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.employeeId = params.get('id');
    });
    if (this.employeeId) {
      this.getEmployee(this.employeeId);
    }
  }

  getEmployee(id: any) {
    this.employeeService.fetchFullEmployee(id).subscribe(res => {
      this.employee = res;

      // Mapping Personal Info
      this.personalInfo = {
        firstname: this.employee?.employee?.firstname || '',
        lastname: this.employee?.employee?.lastname || '',
        email: this.employee?.employee?.email || '',
        phone: this.employee?.empContact[0]?.contact[0]?.phone || '',
        occupation: this.employee?.employee?.occupation || '',
        dob: this.employee?.employee?.dob || '',
        bio: this.employee?.employee?.intro || ''  // Map 'intro' to 'bio'
      };

      // Mapping Experiences
      this.experiences = this.employee?.empExperiences[0]?.experiences.map((exp: any) => ({
        id: exp.id,
        organization: exp.company,
        occupation: exp.position,
        country: exp.country,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description
      })) || [];

      // Mapping Education
      this.education = this.employee?.empEducation[0]?.education.map((edu: any) => ({
        degree: edu.degree,
        school: edu.school,
        country: edu.country,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description,
        present: edu.endDate.toLowerCase() === "present" // Auto-detect "Present" status
      })) || [];

      // Mapping Skills
      this.skills = this.employee?.empSkills[0]?.skills.map((skill: any) => ({
        skill: skill.skill,
        percentage: skill.percentage
      })) || [];

      // Mapping Projects
      this.projects = this.employee?.empProjects[0]?.projects.map((proj: any) => ({
        name: proj.title, // 'title' in backend → 'name' in frontend
        company: proj.company,
        role: proj.role,
        startDate: proj.startDate,
        endDate: proj.endDate,
        demo: proj.demo,
        source: proj.source,
        description: proj.description,
        present: proj.endDate.toLowerCase() === "present"
      })) || [];

      // Mapping Certificates
      this.certificates = this.employee?.empCertificates[0]?.certificates.map((cert: any) => ({
        name: cert.name,
        organization: cert.organization,
        date: cert.date,
        certificateId: cert.certificateId,
        certificateUrl: cert.certificateUrl
      })) || [];

      // Mapping Profile Image (Avatar)
      this.avatar = this.employee?.employee?.image || '';

      // Saving Mapped Data to Local Storage
      this.resumeStorage.saveData('personalInfo', this.personalInfo);
      this.resumeStorage.saveData('workExperiences', this.experiences);
      this.resumeStorage.saveData('educations', this.education);
      this.resumeStorage.saveData('skills', this.skills);
      this.resumeStorage.saveData('projects', this.projects);
      this.resumeStorage.saveData('certificates', this.certificates);
      this.resumeStorage.saveData('avatar', this.avatar);
    });
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
