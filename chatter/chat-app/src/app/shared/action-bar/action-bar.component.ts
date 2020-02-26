import { Component, OnInit } from '@angular/core';
import { PayloadData } from '../interfaces/jwt-payload.interface';
import { User, ChatList, MessageBody } from '../interfaces/user.interface';
import { TokenService } from '../services/token.service';
import { UserService } from '../../streams/services/user.service';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/chat/services/message.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  loggedInUser: PayloadData;
  loggedInUserData: User;
  notificationsLength: number;
  chatListLength: number;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private notificationsService: NotificationsService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUser();

    this.notificationsService.receiveNewNotificationActionSocket().subscribe(() => {
      this.getLoggedInUser();
    });

    // might need fix add proper websocket
    this.messageService.receiveNewChatSocket().subscribe(() => {
      this.getLoggedInUser();
    });
  }

  /**
   * gets logged in user data
   */
  private getLoggedInUser() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;
      if (this.loggedInUserData) {
        // this.notificationsLength = _.filter(this.loggedInUserData.notifications, ['read', false]).length;
        this.getNotificationCount(this.loggedInUserData._id);
        this.checkIfMessagesRead();
      }
    }, (err: HttpErrorResponse) => {
      if (err.error.jwtToken) {
        this.tokenService.deleteToken();
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * checks for unread chat messages
   */
  private checkIfMessagesRead() {
    this.chatListLength = 0;
    if (this.loggedInUserData.chatList) {
      this.loggedInUserData.chatList.forEach((chatList: ChatList) => {
        const lastMessage: MessageBody = chatList.messageId.message[chatList.messageId.message.length - 1];
        if (this.router.url !== `/chat/message/${lastMessage.receivername}`) {
          if (lastMessage.isRead === false && lastMessage.receivername === this.loggedInUser.username) {
            this.chatListLength++;
          }
        }
      });
    }
  }

  /**
   * gets user notification count
   * @param userId user id
   */
  private getNotificationCount(userId: string) {
    this.notificationsService.getNotificationsCount(userId).subscribe((count: number) => {
      this.notificationsLength = count;
    });
  }
}
