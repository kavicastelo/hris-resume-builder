import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../services/auth.service';
import {EmployeeService} from '../../services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-emp-resume-builder',
  standalone: true,
  templateUrl: './emp-resume-builder.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrl: './emp-resume-builder.component.scss'
})
export class EmpResumeBuilderComponent implements OnInit {
  resumeForm!: FormGroup;
  employeeId: any;
  employee: any;
  website: any;
  avatar: any;
  experiences: any[] = [];
  educations: any[] = [];
  skills: any[] = [];
  projects: any[] = [];
  certificates: any[] = [];

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private cookieService: AuthService,
              private employeeService: EmployeeService) {
    this.resumeForm = this.fb.group({
      name: [''],
      role: [''],
      location: [''],
      email: ['', Validators.email],
      phone: [''],
      intro: [''],
      experiences: ['checked'],
      educations: ['checked'],
      skills: ['checked'],
      projects: [''],
      certificates: [''],
      avatar: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.employeeId = params.get('id');
    });
    if (!this.employeeId) {
      this.router.navigate(['/403']);
    }
    this.getEmployee(this.employeeId);
  }

  getEmployee(id: any) {
    this.employeeService.fetchFullEmployee(id).subscribe(res => {
      this.employee = res;
      this.resumeForm.patchValue({
        name: this.employee?.employee?.firstname + ' ' + this.employee?.employee?.lastname || '',
        role: this.employee?.employee?.occupation || '',
        location: this.employee?.empContact[0]?.contact[0]?.city + ', ' + this.employee?.empContact[0]?.contact[0]?.country || '',
        email: this.employee?.empContact[0]?.contact[0]?.email || '',
        phone: this.employee?.empContact[0]?.contact[0]?.phone || '',
        intro: this.employee?.employee?.intro || ''
      });
      this.website = this.employee?.empContact[0]?.contact[0]?.website || '';
      this.avatar = this.employee?.employee?.image || '';
      this.experiences = this.employee?.empExperiences[0]?.experiences || [];
      this.educations = this.employee?.empEducation[0]?.education || [];
      this.skills = this.employee?.empSkills[0]?.skills || [];
      this.projects = this.employee?.empProjects[0]?.projects || [];
      this.certificates = this.employee?.empCertificates[0]?.certificates || [];
    });
  }

  printCV() {
    const content = document.getElementById('cv');
    if (content) {
      window.print();
    }
  }

  openSupport() {
    this.router.navigate(['/support']);
  }
}
