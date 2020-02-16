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
        this.loggedInUser.following.push({ _id: '', userFollowed: { _id: followingUserId } });
        this.displayNotification('success', 'following user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    } else {
      this.userService.unFollowUser(userId).subscribe((unFollowedUserId: string) => {
        this.loggedInUser.following = this.loggedInUser.following.filter((follow) => follow.userFollowed._id !== unFollowedUserId);
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
    return _.some(array, [ 'userFollowed._id', userId ]);
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
      this.users = users;
    });
  }

  /**
   * populates followers list by username
   */
  private populateFollowersListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.getUsersList(usernameParam, 'followers');
    } else {
      this.getUsersList(this.loggedInUserToken.username, 'followers');
    }
  }

  /**
   * populates followers list by username
   */
  private populateFollowingListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.getUsersList(usernameParam, 'following');
    } else {
      this.getUsersList(this.loggedInUserToken.username, 'following');
    }
  }

  /**
   * gets the list of people who follow the user or
   * people the user is following based on type received
   * @param username user's username
   * @param type type of list to populate
   */
  private getUsersList(username: string, type: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      if (type === 'followers') {
        this.users = user.followers
                      .map((userFollowing: UserFollowing) => userFollowing.userFollower);
      } else if (type === 'following') {
        this.users = user.following
                      .map((userFollow: UserFollowed) => userFollow.userFollowed);
      }
    });
  }
}
