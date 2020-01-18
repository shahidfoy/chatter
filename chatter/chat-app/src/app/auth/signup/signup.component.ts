import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TokenResponse } from '../../shared/interfaces/tokenResponse.interface';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  validateForm: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  /**
   * submits sign up form
   */
  submitForm() {
    this.authService.resgisterUser(this.validateForm.value).subscribe((data: TokenResponse) => {
      this.isLoading = true;
      this.tokenService.deleteToken();
      this.tokenService.setToken(data.token);
      // localStorage.setItem('token', data.token);
      setTimeout(() => {
        this.validateForm.reset();
        this.router.navigate(['streams']);
      }, 2000);
    }, err => {
      this.displayError(err.error.message);
    });
  }

  /**
   * displays sign up error message
   * @param message sign up error message
   */
  private displayError(message: string) {
    this.isLoading = false;
    this.notification.create('warning', 'Sign up Error', message);
  }
}
