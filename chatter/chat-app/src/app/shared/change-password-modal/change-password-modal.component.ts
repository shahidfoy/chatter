import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {

  @Input() isVisible: boolean;
  @Output() closeModal = new EventEmitter<boolean>();
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
    });
  }

  /**
   * closes model when ok button is clicked
   * updates users profile image
   */
  handleModalOk() {
    this.isVisible = false;
    this.closeModal.emit(this.isVisible);
  }

  /**
   * closes model when user clicks away from modal
   * updates users profile image
   */
  handleModalCancel() {
    this.isVisible = false;
    this.closeModal.emit(this.isVisible);
  }

  submitForm() {

  }
}
