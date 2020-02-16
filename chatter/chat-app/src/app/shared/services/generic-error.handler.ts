import { Injectable, ErrorHandler } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class GenericErrorHandler implements ErrorHandler {

  constructor(
    // private notification: NzNotificationService,
  ) {}

  /**
   * displays a notification if error message exists
   * @param error incoming error
   */
  handleError(error: any) {
    // if (error.error) {
    //   this.notification.create('error', 'Error', error.error.message);
    // }
  }
}
