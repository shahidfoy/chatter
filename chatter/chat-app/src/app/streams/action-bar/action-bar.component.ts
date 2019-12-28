import { Component, OnInit } from '@angular/core';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { User } from 'src/app/interfaces/user.interface';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from '../services/user.service';
import { NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';

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
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUser();

    this.userService.receiveNewNotificationActionSocket().subscribe(() => {
      this.getLoggedInUser();
    });
  }

  getLoggedInUser() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;
      this.notificationsLength = this.loggedInUserData.notifications.length;
    });
  }

}
