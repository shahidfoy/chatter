import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserFollowed } from '../../interfaces/user-followed.interface';
import { UserService } from '../../services/user.service';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {

  users: User[];
  loggedInUserToken: PayloadData;
  loggedInUser: User;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.loggedInUserToken = this.tokenService.getPayload();
    this.userIsFollowingList();

    this.userService.receiveNewFollowSocket().subscribe(() => {
      this.userIsFollowingList();
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
   * gets the list of people who the user is following
   */
  private userIsFollowingList() {
    this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
      this.loggedInUser = user;
      this.users = this.loggedInUser.following
                    .map((userFollowed: UserFollowed) => userFollowed.userFollowed);
    });
  }

}
