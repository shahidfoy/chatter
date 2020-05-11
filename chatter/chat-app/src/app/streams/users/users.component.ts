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
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private readonly LIMIT = 9;
  private PAGE = 0;

  users: User[];
  loggedInUserToken: PayloadData;
  loggedInUser: User;
  isFollowingObj: any = {};

  isLoading = true;
  paginateMoreUsers = true;

  constructor(
    private userService: UserService,
    public contactService: ContactService,
    private imageService: ImageService,
    private tokenService: TokenService,
    private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.users = [];
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
    this.contactService.checkUserFollowing(this.loggedInUser._id, userId).subscribe((result: boolean) => {
      if (!result) {
        this.contactService.followUser(userId).subscribe((followingUserId: string) => {
          this.isFollowingObj[followingUserId] = true;
          this.displayNotification('success', 'following user');
        }, err => {
          this.displayNotification('error', err.error.message);
        });
      } else {
        this.contactService.unFollowUser(userId).subscribe((unFollowedUserId: string) => {
          this.isFollowingObj[unFollowedUserId] = false;
          this.displayNotification('warning', 'unfollowing user');
        }, err => {
          this.displayNotification('error', err.error.message);
        });
      }
    });
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
  populateUsers() {
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
   * gets all users by pagination page and limit
   */
  private getUsers() {
    this.userService.getUsers(this.PAGE).subscribe((users: User[]) => {
      if (users.length < this.LIMIT) { this.paginateMoreUsers = false; }
      this.users = this.users.length < 1 ? users : this.users.concat(users);
      users.forEach((user: User) => {
        this.checkUserFollowing(this.loggedInUserToken._id, user);
      });
      this.isLoading = false;
      this.PAGE++;
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
      switch (type) {
        case Contacts.FOLLOWERS:
          this.contactService.getUserFollowers(user._id, this.PAGE).subscribe((followers: UserFollower[]) => {
            if (followers.length < this.LIMIT) { this.paginateMoreUsers = false; }
            followers.forEach(userData => {
              this.users.push(userData.userFollower);
              this.checkUserFollowing(this.loggedInUserToken._id, userData.userFollower);
            });
          });
          break;
        case Contacts.FOLLOWING:
          this.contactService.getUserFollowing(user._id, this.PAGE).subscribe((following: UserFollowing[]) => {
            if (following.length < this.LIMIT) { this.paginateMoreUsers = false; }
            following.forEach(userData => {
              this.users.push(userData.userFollowed);
              this.checkUserFollowing(this.loggedInUserToken._id, userData.userFollowed);
            });
          });
          break;
        default:
          // TODO:: set up message to let user know that the list is empty
      }
      this.isLoading = false;
      this.PAGE++;
    });
  }

  /**
   * checks to see if logged in user is following another user
   * and stores it in the isFollowingObj
   * @param loggedInUserId logged in user id
   * @param user user to check
   */
  private checkUserFollowing(loggedInUserId: string, user: User) {
    this.contactService.checkUserFollowing(loggedInUserId, user._id).subscribe((result: boolean) => {
      this.isFollowingObj[user._id] = result;
    });
  }
}
