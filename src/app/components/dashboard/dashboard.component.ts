import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeAuthStateService } from '../../services/cache/employee-auth-state.service';
import { AlertsService } from '../../services/alerts.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userName = 'User';
  employeeId: any;
  resumeExists = false; // logic to check if resume data exists

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private employeeAuthStateService: EmployeeAuthStateService,
    private alertService: AlertsService,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.authService.userID();
    if (id) {
      this.employeeId = id;
      this.employeeService.fetchFullEmployee(id).subscribe(res => {
        if (res && res.employee) {
          this.userName = res.employee.firstname || 'User';
          // Simple heuristic: if we have fetched data, assume resume 'exists' or is searchable
          this.resumeExists = true;
        }
      });
    } else {
      this.login('cv', 'login');
    }
  }

  login(profile: string, action: string) {
    this.authService.login(profile, action);
  }

  logout() {
    this.commonService.logout().subscribe(() => {
      this.authService.logout()
      this.employeeAuthStateService.clearUser();
      this.alertService.successMessage('You have been logged out successfully.', 'Success');
    });
  }
}
