import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TokenResponse } from '../../shared/interfaces/tokenResponse.interface';
import { TokenService } from '../../shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  /**
   * submits form to login
   */
  submitForm() {
    this.authService.loginUser(this.validateForm.value).subscribe((data: TokenResponse) => {
      this.isLoading = true;
      this.tokenService.setToken(data.token);
      setTimeout(() => {
        this.validateForm.reset();
        this.router.navigate(['streams']).catch(err => this.displayError(err));
      }, 3000);
    }, err => {
      console.log('error');
      this.displayError(err.error.message);
    });
  }

  /**
   * displays login error message
   * @param message login error message
   */
  displayError(message: string) {
    this.isLoading = false;
    this.notification.create('warning', 'Log in Error', message);
  }
}
