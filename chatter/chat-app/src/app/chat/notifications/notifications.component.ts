import { Component, OnInit } from '@angular/core';
import { NotificationsObj, User, ChatList } from 'src/app/shared/interfaces/user.interface';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { TokenService } from 'src/app/shared/services/token.service';
import { UserService } from 'src/app/streams/services/user.service';
import { PayloadData } from 'src/app/shared/interfaces/jwt-payload.interface';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  initLoading: boolean;
  loadingMore: boolean;
  data: any[] = [];
  chatList: ChatList[];

  loggedInUser: PayloadData;
  loggedInUserData: User;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUsersChatNotifications();

    // this.messageService.receiveNewChatSocket().subscribe(() => {
    //   this.getLoggedInUsersChatNotifications();
    // });
  }

  /**
   * uses moment to customize time output
   * @param time time stamp
   */
  timeFromNow(time: Date) {
    return timeFromNow(time);
  }

  // /**
  //  * marks notification as read
  //  * @param notification notification to be marked as read
  //  */
  // markNotification(notification: NotificationsObj) {
  //   this.userService.markNotification(notification).subscribe((user: User) => {
  //     this.userService.emitNewNotificationActionSocket();
  //   });
  // }

  // /**
  //  * deletes notification
  //  * @param notification notification to be deleted
  //  */
  // deleteNotification(notification: NotificationsObj) {
  //   this.userService.deleteNotification(notification).subscribe((user: User) => {
  //     this.userService.emitNewNotificationActionSocket();
  //   });
  // }

  // /**
  //  * marks all notifications as read
  //  */
  // markAllNotifications() {
  //   this.userService.markAllNotifications().subscribe((user: User) => {
  //     this.userService.emitNewNotificationActionSocket();
  //   });
  // }

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
  private getLoggedInUsersChatNotifications() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;

      this.chatList = user.chatList;
      this.initLoading = false;
    });
  }
}

