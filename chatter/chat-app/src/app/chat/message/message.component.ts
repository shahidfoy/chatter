import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from '../services/message.service';
import { UserService } from 'src/app/streams/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { Message, MessageContents } from '../interfaces/message.interface';
import { ApplicationStateService } from 'src/app/services/application-state.service';

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

    this.messageService.receiveNewChatSocket().subscribe(() => {
      this.getMessages(this.loggedInUser._id, this.receiverData._id);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.autoScrollContainer.nativeElement.scrollTop = this.autoScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

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

  private getUserByUsername(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.receiverData = user;

      this.getMessages(this.loggedInUser._id, this.receiverData._id);
    });
  }

  private getMessages(senderId: string, receiverId: string) {
    this.messageService.getMessages(senderId, receiverId).subscribe((data: Message) => {
      if (data !== null) {
        this.messages = data.message;
      }
    });
  }
}
