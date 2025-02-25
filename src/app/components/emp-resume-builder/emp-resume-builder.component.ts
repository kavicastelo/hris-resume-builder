import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthService} from '../../services/auth.service';
import {EmployeeService} from '../../services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {Template1Component} from "../resume-builder/templates/template1/template1.component";
import {Template2Component} from "../resume-builder/templates/template2/template2.component";
import {Template3Component} from "../resume-builder/templates/template3/template3.component";
import {ResumeStorageService} from '../../services/resume-storage.service';
import {WindowService} from '../../services/common/window.service';

@Component({
  selector: 'app-emp-resume-builder',
  standalone: true,
  templateUrl: './emp-resume-builder.component.html',
  imports: [
    NgSwitchCase,
    Template1Component,
    Template2Component,
    Template3Component,
    NgSwitch,
    NgIf
  ],
  styleUrl: './emp-resume-builder.component.scss'
})
export class EmpResumeBuilderComponent implements OnInit {
  personalInfo: any = {};
  certificates: any[] = [];
  education: any[] = [];
  projects: any[] = [];
  skills: any[] = [];
  experiences: any[] = [];

  avatar: any;

  selectedCV = 0;

  employeeId: any;
  employee: any;
  replaced: any;
  cv: any;

  loading = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private cookieService: AuthService,
              private windowService: WindowService,
              private resumeStorage: ResumeStorageService,
              private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.queryParamMap.subscribe(params => {
      this.employeeId = params.get('id');
      this.replaced = params.get('replaced');
      this.cv = params.get('cv');
    });
    if (!this.employeeId) {
      this.loading = false;
      this.router.navigate(['/403']);
    }
    switch (this.cv) {
      case '1':
        this.selectedCV = 0;
        break;
      case '2':
        this.selectedCV = 1;
        break;
      case '3':
        this.selectedCV = 2;
        break;
      default:
        this.selectedCV = 0;
        break;
    }
    this.getEmployee(this.employeeId);
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
      if (this.replaced){
        this.resumeStorage.saveData('personalInfo', this.personalInfo);
        this.resumeStorage.saveData('workExperiences', this.experiences);
        this.resumeStorage.saveData('educations', this.education);
        this.resumeStorage.saveData('skills', this.skills);
        this.resumeStorage.saveData('projects', this.projects);
        this.resumeStorage.saveData('certificates', this.certificates);
        this.resumeStorage.saveData('avatar', this.avatar);
        this.resumeStorage.saveData('unlocked', true);
        this.loading = false;
      }
    });
  }

  printCV() {
    if (this.windowService.nativeWindow && this.windowService.nativeDocument) {
      const content = document.getElementById('cv');
      if (content) {
        window.print();
      }
    }
  }

  openSupport() {
    this.router.navigate(['/support']);
  }
}
