import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PayloadData } from '../../../shared/interfaces/jwt-payload.interface';
import { UserFollowed } from '../../interfaces/user-followed.interface';
import * as _ from 'lodash';
import { UserFollowing } from '../../interfaces/user-following.interface';
import { TokenService } from '../../../shared/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { User } from '../../../shared/interfaces/user.interface';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {

  users: User[];
  loggedInUserToken: PayloadData;
  loggedInUserData: User;
  userData: User;

  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private tokenService: TokenService,
    private router: ActivatedRoute,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.loggedInUserToken = this.tokenService.getPayload();
    this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
      this.loggedInUserData = user;
    });

    this.populateFollowersListByUsername();
  }

  /**
   * gets users profile image url
   * @param user user of post
   */
  getAvatarUrl(user: User) {
    if (user.picId) {
      return this.imageService.getUserProfileImage(user.picVersion, user.picId);
    } else {
      return this.imageService.getDefaultProfileImage();
    }
  }

  /**
   * follows selected user
   * @param userId follow request user id
   */
  followUser(userId: string) {
    const userInFollowingArray = this.checkUserInFollowedArray(this.loggedInUserData.following, userId);
    if (!userInFollowingArray) {
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
  private populateFollowersListByUsername() {
    const usernameParam = this.router.snapshot.params.username;
    if (usernameParam) {
      this.userFollowersList(usernameParam);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUserData = user;
        });
        this.userFollowersList(usernameParam);
      });
    } else {
      this.userFollowersList(this.loggedInUserToken.username);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUserData = user;
        });
        this.userFollowersList(this.loggedInUserToken.username);
      });
    }
  }

  /**
   * gets the list of people who follow the user
   */
  private userFollowersList(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.userData = user;
      this.users = this.userData.followers
                    .map((userFollowing: UserFollowing) => userFollowing.userFollower);
      _.remove(this.users, { username: this.userData.username });
      // _.remove(this.users, { username: this.loggedInUserData.username });
    });
  }
}
