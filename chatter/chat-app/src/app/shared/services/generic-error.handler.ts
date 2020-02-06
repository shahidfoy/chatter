import { Injectable, ErrorHandler } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class GenericErrorHandler implements ErrorHandler {

  constructor(
    private notification: NzNotificationService,
  ) {}

  handleError(error: any) {
    if (error.error) {
      this.notification.create('error', 'Error', error.error.message);
    }
  }
}
