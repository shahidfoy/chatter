import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from '../services/message.service';
import { UserService } from 'src/app/streams/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  receiverUsername: string;
  receiverData: User;
  loggedInUser: PayloadData;
  message: string;

  data = [
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' },
    { name: 'Lily' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.receiverUsername = this.activatedRoute.snapshot.params.username;
    this.getUserByUsername(this.receiverUsername);
  }

  getUserByUsername(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.receiverData = user;
    });
  }

  sendMessage() {
    console.log('sending it');
    console.log(this.message);
    if (this.message) {
      this.messageService.sendMessage(
        this.loggedInUser._id,
        this.receiverData._id,
        this.receiverUsername,
        this.message)
      .subscribe(() => {
        console.log('item sent');
        this.message = '';
      });
    }
  }
}
