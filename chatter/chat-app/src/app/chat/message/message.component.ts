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

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewChecked {

  @ViewChild('autoScroll', undefined) private autoScrollContainer: ElementRef;
  isMobile: boolean;
  receiverUsername: string;
  receiverData: User;
  loggedInUser: PayloadData;
  message: string;
  messages: MessageContents[];
  typing = false;

  userImage = 'https://i.pinimg.com/474x/41/03/85/4103858ae55e0713f9dd8d264c60f49b.jpg';
  receiverImage = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UserService,
    private messageService: MessageService,
    private applicationStateService: ApplicationStateService,
  ) { }

  ngOnInit() {
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.loggedInUser = this.tokenService.getPayload();
    this.receiverUsername = this.activatedRoute.snapshot.params.username;
    this.getUserByUsername(this.receiverUsername);

    const chatParams: ChatParams = {
      sender: this.loggedInUser.username,
      receiver: this.receiverUsername
    };

    this.messageService.emitJoinChatSocket(chatParams);

    this.messageService.receiveNewChatSocket().subscribe(() => {
      this.getMessages(this.loggedInUser._id, this.receiverData._id);
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
      .subscribe((message: Message) => {
        this.message = '';
        this.messageService.emitNewChatSocket();
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
   * gets users chat image
   * @param username username
   */
  getUserImage(username: string): string {
    return username === this.loggedInUser.username ? this.userImage : this.receiverImage;
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
   * gets user by username
   * @param username users username
   */
  private getUserByUsername(username: string) {
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
    this.messageService.getMessages(senderId, receiverId).subscribe((data: Message) => {
      if (data !== null) {
        this.messages = data.message;
      }
    });
  }
}
