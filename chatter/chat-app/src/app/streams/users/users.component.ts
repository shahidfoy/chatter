import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../../../app/interfaces/user.interface';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  loggedInUser: PayloadData;

  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.userService.getUsers().subscribe((users: User[]) => {
      _.remove(users, { username: this.loggedInUser.username });
      this.users = users;
    });
  }

}
