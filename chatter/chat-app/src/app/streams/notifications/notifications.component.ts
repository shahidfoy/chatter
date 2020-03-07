import { Component, OnInit } from '@angular/core';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { User } from '../../shared/interfaces/user.interface';
import { UserService } from '../services/user.service';
import { TokenService } from '../../shared/services/token.service';
import { timeFromNow } from '../../shared/shared.utils';
import { ImageService } from '../../shared/services/image.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { Notification } from '../../shared/interfaces/notification.interface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  isLoading = true;
  initLoading: boolean;
  loadingMore: boolean;
  data: any[] = [];
  list: Array<{ loading: boolean; notification: Notification }> = [];

  loggedInUser: PayloadData;
  loggedInUserData: User;
  notifications: Notification[];

  avatarUrl: string;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private tokenService: TokenService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUsersNotifications();

    this.notificationsService.receiveNewNotificationActionSocket().subscribe(() => {
      this.getLoggedInUsersNotifications();
    });
  }

  /**
   * gets users profile image url
   * @param user user of post
   */
  getAvatarUrl(notification: Notification): string {
    if (notification.picId) {
      return this.imageService.getImage(notification.picVersion, notification.picId);
    } else {
      return this.imageService.getDefaultProfileImage();
    }
  }

  /**
   * uses moment to customize time output
   * @param time time stamp
   */
  timeFromNow(time: Date) {
    return timeFromNow(time);
  }

  /**
   * deletes all notifications by user id
   */
  deleteAllNotifications() {
    this.notificationsService.deleteAllNotifications(this.loggedInUserData._id).subscribe(() => {
      this.notificationsService.emitNewNotificationActionSocket();
    });
  }

  /**
   * deletes notification
   * @param notification notification to be deleted
   */
  deleteNotification(notification: Notification) {
    this.notificationsService.deleteNotification(notification._id).subscribe(() => {
      this.notificationsService.emitNewNotificationActionSocket();
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
      this.getNotifications(this.loggedInUserData._id);
      this.initLoading = false;
      this.isLoading = false;
    });
  }

  /**
   * gets notifications
   * @param userId user id
   */
  private getNotifications(userId: string) {
    this.notificationsService.getNotificaitons(userId).subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
      this.list = this.notifications.map(notification => ({ loading: false, notification }));
    });
  }
}
