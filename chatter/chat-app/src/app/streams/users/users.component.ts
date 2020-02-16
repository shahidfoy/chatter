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
      this.userFollowersList(usernameParam);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
        });
        this.userFollowersList(usernameParam);
      });
    } else {
      this.userFollowersList(this.loggedInUserToken.username);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
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
      this.loggedInUser = user;
      this.users = this.loggedInUser.followers
                    .map((userFollowing: UserFollowing) => userFollowing.userFollower);
      _.remove(this.users, { username: this.loggedInUser.username });
      // _.remove(this.users, { username: this.loggedInUserData.username });
    });
  }

  /**
   * populates followers list by username
   */
  private populateFollowingListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.userIsFollowingList(usernameParam);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
        });
        this.userIsFollowingList(usernameParam);
      });
    } else {
      this.userIsFollowingList(this.loggedInUserToken.username);

      this.userService.receiveNewFollowSocket().subscribe(() => {
        this.userService.getUserById(this.loggedInUserToken._id).subscribe((user: User) => {
          this.loggedInUser = user;
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
      this.loggedInUser = user;
      this.users = this.loggedInUser.following
                    .map((userFollow: UserFollowed) => userFollow.userFollowed);
      _.remove(this.users, { username: this.loggedInUser.username });
      // _.remove(this.users, { username: this.loggedInUserData.username });
    });
  }
}
