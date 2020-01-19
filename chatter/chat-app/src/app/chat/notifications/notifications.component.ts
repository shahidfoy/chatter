import { Component, OnInit } from '@angular/core';
import { NotificationsObj, User, ChatList, MessageId, MessageBody } from '../../shared/interfaces/user.interface';
import { timeFromNow } from '../../shared/shared.utils';
import { TokenService } from '../../shared/services/token.service';
import { UserService } from '../../streams/services/user.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUsersChatNotifications();

    // might need fix add proper websocket
    this.messageService.receiveNewChatSocket().subscribe(() => {
      this.getLoggedInUsersChatNotifications();
    });
  }

  /**
   * uses moment to customize time output
   * @param lastMessage last chat message between two users
   */
  timeFromNow(lastMessage: MessageBody): string {
    const sender = lastMessage.sendername === this.loggedInUser.username ? 'you ' : `${lastMessage.sendername} `;
    return sender + timeFromNow(lastMessage.createdAt);
  }

  /**
   * marks notification as read
   * @param notification notification to be marked as read
   */
  markMessage(message: any) {
    const lastMessage = message[message.length - 1];
    console.log('last', lastMessage);

    if (this.router.url !== `/chat/message/${lastMessage.receivername}`) {
      if (lastMessage.isRead === false && lastMessage.receivername === this.loggedInUser.username) {
        // implment service to mark message as read
      }
    }
  }

  /**
   * checks if message is read or if user is the sender of the last message
   * return a string to mark message as read for icon
   * @param lastMessage last message sent
   */
  checkMessageIsRead(lastMessage: MessageBody): string {
    return lastMessage.isRead || lastMessage.sendername === this.loggedInUser.username ? 'twotone' : 'outline';
  }

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
      console.log(this.chatList);
      this.initLoading = false;
    });
  }
}
