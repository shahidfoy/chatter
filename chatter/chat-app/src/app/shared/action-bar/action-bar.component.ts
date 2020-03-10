import { Component, OnInit } from '@angular/core';
import { PayloadData } from '../interfaces/jwt-payload.interface';
import { User, MessageBody } from '../interfaces/user.interface';
import { TokenService } from '../services/token.service';
import { UserService } from '../../streams/services/user.service';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/chat/services/message.service';
import { NotificationsService } from '../services/notifications.service';
import { PostService } from 'src/app/streams/services/post.service';
import { Conversation } from 'src/app/chat/interfaces/conversation.interface';

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
    private notificationsService: NotificationsService,
    private messageService: MessageService,
    private postService: PostService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUser();

    this.notificationsService.receiveNewNotificationActionSocket().subscribe(() => {
      this.getLoggedInUser();
    });

    this.postService.receiveNewCommentSocket().subscribe(() => {
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

    if (this.loggedInUserData) {
      this.messageService.getConversationsList().subscribe((conversations: Conversation[]) => {
        conversations.forEach((conversation: Conversation) => {
          const lastMessage: MessageBody = conversation.messageId.message[conversation.messageId.message.length - 1];
          if (this.router.url !== `/chat/message/${lastMessage.receivername}`) {
            if (lastMessage.isRead === false && lastMessage.receivername === this.loggedInUser.username) {
              this.chatListLength++;
            }
          }
        });
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
