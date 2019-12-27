import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { UserFollowed } from '../../interfaces/user-followed.interface';
import { UserService } from '../../services/user.service';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService, NzConfigService } from 'ng-zorro-antd';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {

  users: User[];
  loggedInUserToken: PayloadData;
  loggedInUserData: User;
  userData: User;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: ActivatedRoute,
    private notification: NzNotificationService,
    private nzConfigService: NzConfigService,
  ) { }

  ngOnInit() {
    this.loggedInUserToken = this.tokenService.getPayload();
    this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
      this.loggedInUserData = user;
    });

    this.populateFollowingListByUsername();
  }

  /**
   * follows or unfollows selected user
   * @param userId follow request user id
   */
  followUser(userId: string) {
    const userInFollowedArray = this.checkUserInFollowedArray(this.loggedInUserData.following, userId);

    if (!userInFollowedArray) {
      this.userService.followUser(userId).subscribe((followingUserId: string) => {
        this.userService.emitNewFollowSocket();
        this.displayNotification('success', 'following user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    } else {
      this.userService.unFollowUser(userId).subscribe((unFollowedUserId: string) => {
        this.userService.emitNewFollowSocket();
        this.displayNotification('warning', 'unfollowing user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    }
  }

  /**
   * displays notifications
   * @param type type of notification
   * @param message message to be displayed
   */
  displayNotification(type: string, message: string) {
    this.notification.create(type, message, '');
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
   * populates followers list by username
   */
  private populateFollowingListByUsername() {
    const usernameParam = this.router.snapshot.params.username;
    if (usernameParam) {
      this.userIsFollowingList(usernameParam);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUserData = user;
        });
        this.userIsFollowingList(usernameParam);
      });
    } else {
      this.userIsFollowingList(this.loggedInUserToken.username);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUserData = user;
        });
        this.userIsFollowingList(this.loggedInUserToken.username);
      });
    }
  }

  /**
   * gets the list of people who the user is following
   */
  private userIsFollowingList(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.userData = user;
      this.users = this.userData.following
                    .map((userFollow: UserFollowed) => userFollow.userFollowed);
      _.remove(this.users, { username: this.userData.username });
      _.remove(this.users, { username: this.loggedInUserData.username });
    });
  }

}
