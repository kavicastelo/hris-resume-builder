import {AfterViewInit, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {AlertsService} from '../../../services/alerts.service';
import {NgClass} from '@angular/common';
import {CredentialService} from '../../../services/credential.service';
import {EncryptionService} from '../../../services/encryption.service';

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
export class SignInComponent implements AfterViewInit{

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
    private alertService: AlertsService) { }

  ngAfterViewInit() {
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

  loginUser() {
    this.attempts --;
    if (this.loginForm.valid) {
      if (this.attempts <= 0 || sessionStorage.getItem('LgnAtT') == '0'){
        sessionStorage.setItem('LgnAtT', '0');
        this.alertService.warningMessage('Too many attempts! Try again in 5 minutes', 'Warning');
        this.loginForm.reset();
        this.disabled = true;
        setTimeout(()=>{
          this.attempts = 4;
          sessionStorage.removeItem('LgnAtT');
          this.disabled = false;
        }, 1000 * 60 * 5);
        return;
      }

      const formData = this.loginForm.value;
      this.credentialService.fetchCredentialByEmail(formData.email).subscribe(async (response: any) => {
        if (!response) {
          this.alertService.errorMessage('User doesn\'t exist or something went wrong', 'Error');
          return;
        }

        const encryptedPassword = await this.encryptionService.decryptPassword(response.password?.toString());

        if (sessionStorage.getItem('LgnAtT') != '0'){
          if (formData.password == encryptedPassword) {
            this.cookieService.createSession(response);

            if (this.loginForm.get('remember')?.value) {
              localStorage.setItem('email', <string>this.loginForm.get('email')?.value);
              localStorage.setItem('password', <string>this.loginForm.get('password')?.value);
            } else {
              localStorage.removeItem('email');
              localStorage.removeItem('password');
            }

            this.cookieService.createUserID(response.employeeId);
            this.cookieService.unlock();
            this.router.navigate(['/builder'], {queryParams: {id: response.employeeId}});
            this.alertService.successMessage('Login successful', 'Success');
            window.location.reload();
          } else {
            this.alertService.errorMessage('Wrong password', 'Error');
          }
        } else {
          this.alertService.errorMessage('Too many attempts! Try again in 5 minutes', 'Warning');
        }

      }, error => {
        this.alertService.errorMessage('Something went wrong', 'Error');
      });
    } else {
      this.alertService.errorMessage('Form is not valid', 'Error');
    }
  }

  togglePasswordVisibility(){
    const input: HTMLInputElement = document.getElementById('password') as HTMLInputElement;
    if (input.type === 'password'){
      input.type = 'text';
      this.isp1open = false;
    } else {
      input.type = 'password';
      this.isp1open = true;
    }
  }
}
