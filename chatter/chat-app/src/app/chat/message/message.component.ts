import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';
import { MessageService } from '../services/message.service';
import { UserService } from 'src/app/streams/services/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { PayloadData } from 'src/app/shared/interfaces/jwt-payload.interface';
import { Message, MessageContents } from '../interfaces/message.interface';
import { ApplicationStateService } from 'src/app/shared/services/application-state.service';
import { ChatParams } from '../interfaces/chat-params.interface';
import { ImageService } from 'src/app/shared/services/image.service';
import { Conversation } from '../interfaces/conversation.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewChecked {

  @ViewChild('autoScroll') private autoScrollContainer: ElementRef;
  isMobile: boolean;
  conversation: Conversation;
  receiverUsername: string;
  receiverData: User;
  loggedInUser: PayloadData;
  loggedInUserData: User;
  message: string;
  messages: MessageContents[];
  chatErrorMessage: string;
  typing = false;
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UserService,
    private messageService: MessageService,
    private imageService: ImageService,
    private applicationStateService: ApplicationStateService,
  ) { }

  ngOnInit() {
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.loggedInUser = this.tokenService.getPayload();
    this.userService.getUserById(this.loggedInUser._id).subscribe((user: User) => {
      this.loggedInUserData = user;
    });
    this.receiverUsername = this.activatedRoute.snapshot.params.username;
    this.getUserByUsernameWithMessages(this.receiverUsername);
    this.markMessagesAsRead();

    const chatParams: ChatParams = {
      sender: this.loggedInUser.username,
      receiver: this.receiverUsername
    };

    this.messageService.emitJoinChatSocket(chatParams);

    this.messageService.receiveNewChatSocket().subscribe(() => {
      this.getUserByUsernameWithMessages(this.receiverUsername);
    });

    this.messageService.receiveTypingSocket().subscribe((data: ChatParams) => {
      if (data.sender === this.receiverUsername) {
        this.typing = true;
      }
    });

    this.messageService.receiveStopTypingSocket().subscribe((data: ChatParams) => {
      if (data.sender === this.receiverUsername) {
        this.typing = false;
      }
    });

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * sends message to receiver
   */
  sendMessage() {
    if (this.message) {
      this.messageService.sendMessage(
        this.loggedInUser._id,
        this.receiverData._id,
        this.receiverUsername,
        this.message)
      .subscribe(
        (message: Message) => {
          this.message = '';
          this.messageService.emitNewChatSocket();
          this.chatErrorMessage = undefined;
        },
        (err: HttpErrorResponse) => {
          this.chatErrorMessage = err.error.message;
        });
      }
  }

  /**
   * detects if user is typing
   */
  isTyping() {
    this.messageService.emitTypingSocket(this.loggedInUser.username, this.receiverUsername);

    setTimeout(() => {
      this.messageService.emitStopTypingSocket(this.loggedInUser.username, this.receiverUsername);
    }, 3000);
  }

  /**
   * gets user's chat image
   * @param username username
   */
  getUserAvatar(userId: any): string {
    if (userId === this.loggedInUser._id) {
      return this.imageService.getImage(this.loggedInUserData.picVersion, this.loggedInUserData.picId);
    } else if (this.conversation.receiverId._id !== this.loggedInUser._id) {
      return this.imageService.getImage(this.conversation.receiverId.picVersion, this.conversation.receiverId.picId);
    } else {
      return this.imageService.getImage(this.conversation.senderId.picVersion, this.conversation.senderId.picId);
    }
  }

  /**
   * marks receivers messages as read
   */
  markMessagesAsRead() {
    this.messageService.markReceiverMessages(this.loggedInUser.username, this.receiverUsername)
      .subscribe(() => {
        this.messageService.emitNewChatSocket();
      });
  }

  /**
   * scrolls to bottom of chat message
   */
  private scrollToBottom(): void {
    try {
      this.autoScrollContainer.nativeElement.scrollTop = this.autoScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  /**
   * gets user by username and messages between the users
   * @param username users username
   */
  private getUserByUsernameWithMessages(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.receiverData = user;

      this.getMessages(this.loggedInUser._id, this.receiverData._id);
    });
  }

  /**
   * gets chat messages between two users
   * @param senderId senders id
   * @param receiverId receivers id
   */
  private getMessages(senderId: string, receiverId: string) {
    this.messageService.getMessages(senderId, receiverId).subscribe((conversation: Conversation) => {
      if (conversation !== null) {
        this.conversation = conversation;
        this.messages = conversation.messageId.message;
        this.isLoading = false;
      }
    });
  }
}
