import { Component, OnInit } from '@angular/core';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { NotificationsObj, User } from 'src/app/interfaces/user.interface';
import { UserService } from '../services/user.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  initLoading: boolean;
  loadingMore: boolean;
  data: any[] = [];
  list: Array<{ loading: boolean; notification: NotificationsObj }> = [];

  loggedInUser: PayloadData;
  loggedInUserData: User;
  notifications: NotificationsObj[];

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUsersNotifications();

    this.userService.receiveNewFollowSocket().subscribe(() => {
      this.getLoggedInUsersNotifications();
    });
  }

  // onLoadMore(): void {
  //   this.loadingMore = true;
  //   this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
  //   this.http.get(fakeDataUrl).subscribe((res: any) => {
  //     this.data = this.data.concat(res.results);
  //     this.list = [...this.data];
  //     this.loadingMore = false;
  //   });
  // }

  private getLoggedInUsersNotifications() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;
      this.notifications = user.notifications;
      this.list = this.notifications.map(notification => ({ loading: false, notification }));
      this.initLoading = false;
    });
  }
}
