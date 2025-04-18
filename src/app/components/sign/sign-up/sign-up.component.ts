import {AfterViewInit, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../services/alerts.service';
import {AuthService} from '../../../services/auth.service';
import {NgClass} from '@angular/common';
import {CredentialService} from '../../../services/credential.service';
import {EncryptionService} from '../../../services/encryption.service';
import {CommonService} from '../../../services/common.service';
import {WindowService} from '../../../services/common/window.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: true
})
export class SignUpComponent implements AfterViewInit{
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    termsCheck: new FormControl(false, [Validators.requiredTrue]),
    newsCheck: new FormControl(false)
  });

  isp1open: boolean = true;
  errorMsg = '';
  termsErrorMsg = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private credentialService: CredentialService,
              private alertService: AlertsService,
              private encryptionService: EncryptionService,
              private commonService: CommonService,
              private windowService: WindowService,
              private cookieService: AuthService) { }

  ngAfterViewInit() {
    if (this.windowService.nativeDocument){
      const icons = document.querySelectorAll('.material-icons');
      icons.forEach((icon) => {
        icon.setAttribute('translate', 'no');
      });
    }
  }

  async registerUser() {
    this.errorMsg = '';
    this.termsErrorMsg = '';
    if (this.registerForm.get('termsCheck')?.invalid) {
      this.termsErrorMsg = 'Please accept the terms and conditions';
      this.alertService.errorMessage(this.termsErrorMsg, 'Missing Fields');
      return;
    }

    if (this.registerForm.get('newsCheck')?.value === true && this.registerForm.get('email')?.valid) {
      const email: string = this.registerForm.get('email')?.value!;
      this.commonService.subscribeNewsLatter(email).subscribe();
    }

    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const password = formData.password;
      const referer = this.cookieService.getReferer() || null;
      const platform = this.cookieService.getPlatform();
      const promotion = this.cookieService.getPromotion() || null;

      if (password && password.length >= 6) {
        const isPwned = await this.encryptionService.checkLeakedPassword(password);
        if (isPwned) {
          this.alertService.errorMessage('This password has been compromised in data breaches. Please choose a different one.', 'Weak Password');
          return;
        }

        const email: string = formData.email!;

        this.credentialService.register({
          firstname: formData.name?.split(' ')[0],
          lastname: formData.name?.split(' ')[1] || '',
          email: formData.email,
          password: password,
          role: "candidate",
          userLevel: "1",
          referrerId: referer,
          platform: platform,
          promotion: promotion,
          active: true
        }).subscribe((response: any) => {
          if (!response) {
            this.alertService.errorMessage('An unexpected error has occurred', 'Unexpected Error');
            return;
          }
          if (response.accessedPlatforms?.includes(platform) && response.accessedPlatforms?.includes('ResumeBuilder')) {
            this.alertService.errorMessage('This email has already been registered', 'Email Already Exists');
            return;
          }
          this.cookieService.createUserID(response.employeeId);
          this.cookieService.createAuthToken(response.token);
          this.cookieService.createRefreshToken(response.refreshToken);
          setTimeout(() => {
            this.commonService.sendWelcomeEmail(email).subscribe();
          }, 1000);
          this.router.navigate(['/resume-builder'], {queryParams: {id: response.employeeId, view: 8}});
          this.alertService.successMessage('User registered successfully', 'Success');
          setTimeout(() => {
            if (this.windowService.nativeWindow)
              window.location.reload();
          }, 2000);
          if (this.windowService.nativeSessionStorage){
            if (sessionStorage.getItem('redirect')) {
              this.router.navigate([sessionStorage.getItem('redirect')]);
            } else {
              this.router.navigate(['/']);
            }
            this.alertService.successMessage('Registration successful!', 'Success');
            sessionStorage.removeItem('redirect');
          }
        }, (error: HttpErrorResponse) => {
          switch (error.status) {
            case 409:
              this.alertService.errorMessage('This email has already been registered', 'Email Already Exists');
              break;
            case 400:
              this.alertService.errorMessage('Please fill in all the required fields', 'Missing Fields');
              break;
            case 500:
              this.alertService.errorMessage('An unexpected error has occurred', 'Unexpected Error');
              break;
            default:
              this.alertService.errorMessage(error.error.message, "Code: "+error.status);
          }
        });
      } else {
        this.alertService.errorMessage('Password must be at least 6 characters long', 'Weak Password');
      }
    } else {
      this.errorMsg = 'Please fill in all the fields';
      this.alertService.errorMessage('Please fill in all required fields', 'Missing Fields');
    }
  }

  togglePasswordVisibility(){
    if (this.windowService.nativeDocument){
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
}
