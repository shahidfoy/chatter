import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import * as _ from 'lodash';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import { User } from '../../shared/interfaces/user.interface';
import { ImageService } from '../../shared/services/image.service';
import { ActivatedRoute } from '@angular/router';
import { UserFollowing } from '../interfaces/user-following.interface';
import { Contacts } from '../enums/contacts.enum';
import { ContactService } from '../services/contact.service';
import { UserFollower } from '../interfaces/user-follower.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  isLoading = true;
  users: User[];
  loggedInUserToken: PayloadData;
  loggedInUser: User;
  loggedInUserFollowers: UserFollower[];
  loggedInUserFollowing: UserFollowing[];

  constructor(
    private userService: UserService,
    private contactService: ContactService,
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
    // TODO:: create endpoint to check if user is following on the backend
    const userInFollowingArray = this.checkUserInFollowingArray(this.loggedInUserFollowing, userId);

    if (!userInFollowingArray) {
      this.contactService.followUser(userId).subscribe((followingUserId: string) => {
        this.loggedInUserFollowing.push({ _id: '', userId: this.loggedInUser._id, userFollowed: { _id: followingUserId } });
        this.displayNotification('success', 'following user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    } else {
      this.contactService.unFollowUser(userId).subscribe((unFollowedUserId: string) => {
        this.loggedInUserFollowing = this.loggedInUserFollowing.filter((follow) => follow.userFollowed._id !== unFollowedUserId);
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
   * uses lodash to check if the user is in the username array
   * TODO:: replace with endpoint service
   * @param array array of followed users
   * @param userId users id
   */
  checkUserInFollowingArray(array: UserFollowing[], userId: string) {
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

    this.contactService.getUserFollowers(userId).subscribe((followers: UserFollower[]) => {
      this.loggedInUserFollowers = followers;
    });

    this.contactService.getUserFollowing(userId).subscribe((following: UserFollowing[]) => {
      this.loggedInUserFollowing = following;
    });
  }

  /**
   * populates users based on route url path
   */
  private populateUsers() {
    switch (this.activatedRoute.snapshot.url[0].path) {
      case Contacts.FOLLOWERS:
        this.populateFollowersListByUsername();
        break;
      case Contacts.FOLLOWING:
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
      this.isLoading = false;
    });
  }

  /**
   * populates followers list by username
   */
  private populateFollowersListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.getUsersList(usernameParam, Contacts.FOLLOWERS);
    } else {
      this.getUsersList(this.loggedInUserToken.username, Contacts.FOLLOWERS);
    }
  }

  /**
   * populates followers list by username
   */
  private populateFollowingListByUsername() {
    const usernameParam = this.activatedRoute.snapshot.params.username;
    if (usernameParam) {
      this.getUsersList(usernameParam, Contacts.FOLLOWING);
    } else {
      this.getUsersList(this.loggedInUserToken.username, Contacts.FOLLOWING);
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
      if (type === Contacts.FOLLOWERS) {
        this.contactService.getUserFollowers(user._id).subscribe((followers: UserFollower[]) => {
          this.users = [];
          followers.forEach(userData => this.users.push(userData.userFollower));
        });
      } else if (type === Contacts.FOLLOWING) {
        this.contactService.getUserFollowing(user._id).subscribe((following: UserFollowing[]) => {
          this.users = [];
          following.forEach(userData => this.users.push(userData.userFollowed));
        });
      }
      this.isLoading = false;
    });
  }
}
