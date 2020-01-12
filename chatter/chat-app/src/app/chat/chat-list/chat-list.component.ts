import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/streams/services/user.service';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { User, ChatList } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  loggedInUser: PayloadData;
  loggedInUserData: User;
  chatList: ChatList[];
  users: string[] = [];

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getUserByUsername(this.loggedInUser.username);
  }

  private getUserByUsername(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.loggedInUserData = user;
      this.chatList = user.chatList;
      this.chatList.forEach(chat => {
        this.getUserById(chat.receiverId);
      });
    });
  }

  getUserById(id: string) {
    this.userService.getUserById(id).subscribe((user: User) => {
      this.users = [user.username, ...this.users];
    });
  }
}
