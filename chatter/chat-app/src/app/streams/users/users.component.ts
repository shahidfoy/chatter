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
  loggedInUserData: User;

  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getLoggedInUser(this.loggedInUser._id);
    this.getUsers();
  }

  /**
   * gets user by id
   * @param userId user's id
   */
  getUserById(userId: string) {
    this.userService.getUserById(userId).subscribe((user: User) => {
      console.log(user);
    });
  }

  /**
   * follows selected user
   * @param userId follow request user id
   */
  followUser(userId: string) {
    this.userService.followUser(userId).subscribe((followingUserId: string) => {
      console.log('following', followingUserId);
      // TODO:: NOIFY USER THAT THEY ARE FOLLOWING THE OTHER USER
    });
  }

  /**
   * uses lodash to check if the user is in the username array
   * @param array array of usernames
   * @param username user
   */
  checkUserInArray(array: any[], userId: string) {
    return _.find(array, [ 'userFollowed._id', userId ]);
  }

  /**
   * gets all users
   * TODO:: add pagination
   */
  private getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      _.remove(users, { username: this.loggedInUser.username });
      this.users = users;
    });
  }

  /**
   * gets logged in user
   * @param userId logged in user id
   */
  private getLoggedInUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: User) => {
      console.log(user);
      this.loggedInUserData = user;
    });
  }
}
