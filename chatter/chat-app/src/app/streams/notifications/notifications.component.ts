import { Component, OnInit } from '@angular/core';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { NotificationsObj, User } from '../../shared/interfaces/user.interface';
import { UserService } from '../services/user.service';
import { TokenService } from '../../shared/services/token.service';
import { timeFromNow } from '../../shared/shared.utils';

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

    this.userService.receiveNewNotificationActionSocket().subscribe(() => {
      this.getLoggedInUsersNotifications();
    });
  }

  /**
   * uses moment to customize time output
   * @param time time stamp
   */
  timeFromNow(time: Date) {
    return timeFromNow(time);
  }

  /**
   * marks notification as read
   * @param notification notification to be marked as read
   */
  markNotification(notification: NotificationsObj) {
    this.userService.markNotification(notification).subscribe((user: User) => {
      this.userService.emitNewNotificationActionSocket();
    });
  }

  /**
   * deletes notification
   * @param notification notification to be deleted
   */
  deleteNotification(notification: NotificationsObj) {
    this.userService.deleteNotification(notification).subscribe((user: User) => {
      this.userService.emitNewNotificationActionSocket();
    });
  }

  /**
   * marks all notifications as read
   */
  markAllNotifications() {
    this.userService.markAllNotifications().subscribe((user: User) => {
      this.userService.emitNewNotificationActionSocket();
    });
  }

  // IMPLEMENT THIS LATER TO LOAD NOTIFICATIONS
  // onLoadMore(): void {
  //   this.loadingMore = true;
  //   this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
  //   this.http.get(fakeDataUrl).subscribe((res: any) => {
  //     this.data = this.data.concat(res.results);
  //     this.list = [...this.data];
  //     this.loadingMore = false;
  //   });
  // }

  /**
   * gets logged in users notifications
   */
  private getLoggedInUsersNotifications() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;
      this.notifications = user.notifications
                                .sort((current, next) => {
                                  return +new Date(next.createdAt) - +new Date(current.createdAt);
                                });
      this.list = this.notifications.map(notification => ({ loading: false, notification }));
      this.initLoading = false;
    });
  }
}