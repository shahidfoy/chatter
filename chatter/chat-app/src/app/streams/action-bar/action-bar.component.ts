import { Component, OnInit } from '@angular/core';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { User } from 'src/app/interfaces/user.interface';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from '../services/user.service';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  loggedInUser: PayloadData;
  loggedInUserData: User;
  notificationsLength: number;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUser();

    this.userService.receiveNewNotificationActionSocket().subscribe(() => {
      this.getLoggedInUser();
    });
  }

  /**
   * gets logged in user data
   */
  getLoggedInUser() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;
      // this.notificationsLength = this.loggedInUserData.notifications.length;
      this.notificationsLength = _.filter(this.loggedInUserData.notifications, ['read', false]).length;
    }, (err: HttpErrorResponse) => {
      if (err.error.jwtToken) {
        this.tokenService.deleteToken();
        this.router.navigate(['/']);
      }
    });
  }

}
