import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import * as _ from 'lodash';
import { TokenService } from '../../services/token.service';
import { PayloadData } from '../../interfaces/jwt-payload.interface';
import { UserFollowed } from '../interfaces/user-followed.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  loggedInUserToken: PayloadData;
  loggedInUser: User;

  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.loggedInUserToken = this.tokenService.getPayload();
    this.getLoggedInUser(this.loggedInUserToken._id);
    this.getUsers();

    this.userService.receiveNewFollowSocket().subscribe(() => {
      this.getLoggedInUser(this.loggedInUserToken._id);
      this.getUsers();
    });
  }

  /**
   * follows or unfollows selected user
   * @param userId follow request user id
   */
  followUser(userId: string) {
    const userInFollowedArray = this.checkUserInFollowedArray(this.loggedInUser.following, userId);

    if (!userInFollowedArray) {
      this.userService.followUser(userId).subscribe((followingUserId: string) => {
        // TODO:: NOIFY USER THAT THEY ARE FOLLOWING THE OTHER USER
        // this.loggedInUserData.following.push({ userFollowed: { _id: userId } });
        // note:: emitting might use above method to pass the data
        this.userService.emitNewFollowSocket();
      });
    } else {
      this.userService.unFollowUser(userId).subscribe((unFollowedUserId: string) => {
        this.userService.emitNewFollowSocket();
      });
    }
  }

  /**
   * uses lodash to check if the user id is in the logged in users following array
   * @param array array of followed users
   * @param userId users id
   */
  checkUserInFollowedArray(array: UserFollowed[], userId: string) {
    return _.find(array, [ 'userFollowed._id', userId ]);
  }

  /**
   * gets all users
   * TODO:: add pagination
   */
  private getUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      _.remove(users, { username: this.loggedInUserToken.username });
      this.users = users;
    });
  }

  /**
   * gets logged in user
   * @param userId logged in user id
   */
  private getLoggedInUser(userId: string) {
    this.userService.getUserById(userId).subscribe((user: User) => {
      this.loggedInUser = user;
    });
  }
}
