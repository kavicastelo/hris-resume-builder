import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertsService } from '../../../services/alerts.service';
import { NgClass } from '@angular/common';
import { CredentialService } from '../../../services/credential.service';
import { EncryptionService } from '../../../services/encryption.service';
import { WindowService } from '../../../services/common/window.service';
import { TimerService } from '../../../services/common/timer.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true
})
export class SignInComponent implements AfterViewInit {

  attempts = 4;
  disabled: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });

  isp1open: boolean = true;

  constructor(
    private router: Router,
    private credentialService: CredentialService,
    private encryptionService: EncryptionService,
    private cookieService: AuthService,
    private timerService: TimerService,
    private windowService: WindowService,
    private alertService: AlertsService) { }

  ngAfterViewInit() {
    if (this.windowService.nativeDocument && this.windowService.nativeLocalStorage) {
      const icons = document.querySelectorAll('.material-icons');
      icons.forEach((icon) => {
        icon.setAttribute('translate', 'no');
      });

      if (localStorage.getItem('email') && localStorage.getItem('password')) {
        this.loginForm.get('email')?.setValue(localStorage.getItem('email'));
        this.loginForm.get('password')?.setValue(localStorage.getItem('password'));
        this.loginForm.get('remember')?.setValue(true);
      }
    }
  }

  loginUser() {
    this.attempts--;
    if (this.loginForm.valid) {
      if (this.windowService.nativeSessionStorage && this.windowService.nativeLocalStorage) {
        if (this.attempts <= 0 || sessionStorage.getItem('LgnAtT') == '0') {
          sessionStorage.setItem('LgnAtT', '0');
          this.alertService.warningMessage('Too many attempts! Try again in 5 minutes', 'Warning');
          this.loginForm.reset();
          this.disabled = true;
          this.timerService.setTimeout(() => {
            this.attempts = 4;
            sessionStorage.removeItem('LgnAtT');
            this.disabled = false;
          }, 1000 * 60 * 5);
          return;
        }

        const formData = this.loginForm.value;
        this.credentialService.login(formData.email, formData.password).subscribe(async (response: any) => {
          if (!response) {
            this.alertService.errorMessage('User doesn\'t exist or something went wrong', 'Error');
            return;
          }
          if (response.disabled) {
            this.alertService.errorMessage('Your account is disabled', 'Error');
            return;
          }

          if (sessionStorage.getItem('LgnAtT') != '0') {
            this.cookieService.createSession(response);

            if (this.loginForm.get('remember')?.value) {
              localStorage.setItem('email', <string>this.loginForm.get('email')?.value);
              localStorage.setItem('password', <string>this.loginForm.get('password')?.value);
            } else {
              localStorage.removeItem('email');
              localStorage.removeItem('password');
            }

            this.cookieService.createUserID(response.employeeId);
            this.cookieService.createAuthToken(response.token);
            this.cookieService.createRefreshToken(response.refreshToken);
            this.cookieService.unlock();

            await this.router.navigate(['/dashboard'], { queryParams: { id: response.employeeId } });

            if (response.active) {
              this.alertService.successMessage('Login successful', 'Success');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              this.alertService.warningMessage('Your account is not active yet! Stay tuned', 'Warning');
            }

            sessionStorage.removeItem('redirect');
          } else {
            this.alertService.errorMessage('Too many attempts! Try again in 5 minutes', 'Warning');
          }
        }, error => {
          this.alertService.errorMessage(error.error.message, "Code: " + error.status);
        });
      }
    } else {
      this.alertService.errorMessage('Form is not valid. Please fill in all the required fields', 'Error');
    }
  }

  togglePasswordVisibility() {
    if (this.windowService.nativeDocument) {
      const input: HTMLInputElement = document.getElementById('password') as HTMLInputElement;
      if (input.type === 'password') {
        input.type = 'text';
        this.isp1open = false;
      } else {
        input.type = 'password';
        this.isp1open = true;
      }
    }
  }
}
