import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayloadData } from '../interfaces/jwt-payload.interface';
import { TokenService } from '../services/token.service';
import { AuthService } from '../../auth/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { MessageResponse } from '../interfaces/message-response.interface';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {

  @Input() isVisible: boolean;
  @Output() closeModal = new EventEmitter<boolean>();
  validateForm: FormGroup;
  payload: PayloadData;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private authService: AuthService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]],
    });

    this.payload = this.tokenService.getPayload();
  }

  /**
   * closes model when ok button is clicked
   * updates users profile image
   */
  handleModalOk() {
    this.isVisible = false;
    this.validateForm.reset();
    this.closeModal.emit(this.isVisible);
  }

  /**
   * closes model when user clicks away from modal
   * updates users profile image
   */
  handleModalCancel() {
    this.isVisible = false;
    this.validateForm.reset();
    this.closeModal.emit(this.isVisible);
  }

  /**
   * changes the users password
   */
  changePassword() {
    const updatePassword = this.validate(this.validateForm);
    if (updatePassword) {
      this.authService.changePassword(this.validateForm.value).subscribe((response: MessageResponse) => {
        console.log('changing password');
        console.log(response);
        this.notification.create('success', 'Password Updated', response.message);
        this.handleModalOk();
      });
    }
  }

  validate(passwordFormGroup: FormGroup) {
    const newPassword = passwordFormGroup.controls.newPassword.value;
    const confirmNewPassword = passwordFormGroup.controls.confirmNewPassword.value;

    if (confirmNewPassword !== newPassword) {
      this.notification.create('error', 'Error', 'New passwords do not match');
      return false;
    }
    return true;
  }
}
