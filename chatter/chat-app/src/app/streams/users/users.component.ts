import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import * as _ from 'lodash';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { UserFollowed } from '../interfaces/user-followed.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import { User } from '../../shared/interfaces/user.interface';
import { ImageService } from '../../shared/services/image.service';
import { ActivatedRoute } from '@angular/router';
import { UserFollowing } from '../interfaces/user-following.interface';

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
    private imageService: ImageService,
    private tokenService: TokenService,
    private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loggedInUserToken = this.tokenService.getPayload();
    this.getLoggedInUser(this.loggedInUserToken._id);
    this.populateUsers();

    this.userService.receiveNewFollowSocket().subscribe(() => {
      this.getLoggedInUser(this.loggedInUserToken._id);
      this.populateUsers();
    });
  }

  /**
   * gets users profile image url
   * @param user user of post
   */
  getAvatarUrl(user: User) {
    if (user.picId) {
      return this.imageService.getImage(user.picVersion, user.picId);
    } else {
      return this.imageService.getDefaultProfileImage();
    }
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
   * populates users based on route url path
   */
  private populateUsers() {
    switch (this.activatedRoute.snapshot.url[0].path) {
      case 'followers':
        this.populateFollowersListByUsername();
        break;
      case 'following':
        this.populateFollowingListByUsername();
        break;
      default:
        this.getUsers();
        break;
    }
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

  /**
   * populates followers list by username
   */
  private populateFollowersListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.getUsersList(usernameParam, 'followers');

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
        });
        this.getUsersList(usernameParam, 'followers');
      });
    } else {
      this.getUsersList(this.loggedInUserToken.username, 'followers');

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
        });
        this.getUsersList(this.loggedInUserToken.username, 'followers');
      });
    }
  }

  /**
   * populates followers list by username
   */
  private populateFollowingListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.getUsersList(usernameParam, 'following');

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
        });
        this.getUsersList(usernameParam, 'following');
      });
    } else {
      this.getUsersList(this.loggedInUserToken.username, 'following');

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
        });
        this.getUsersList(this.loggedInUserToken.username, 'following');
      });
    }
  }

  /**
   * gets the list of people who follow the user
   */
  private getUsersList(username: string, type: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.loggedInUser = user;
      if (type === 'followers') {
        this.users = this.loggedInUser.followers
                      .map((userFollowing: UserFollowing) => userFollowing.userFollower);
        _.remove(this.users, { username: this.loggedInUser.username });
      } else if (type === 'following') {
        this.users = this.loggedInUser.following
                      .map((userFollow: UserFollowed) => userFollow.userFollowed);
        _.remove(this.users, { username: this.loggedInUser.username });
      }
    });
  }
}
