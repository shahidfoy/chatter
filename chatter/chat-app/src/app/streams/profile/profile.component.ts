import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { User } from '../../shared/interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { ApplicationStateService } from 'src/app/shared/services/application-state.service';
import { UserService } from '../services/user.service';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd';
import { UserFollowing } from '../interfaces/user-following.interface';
import { UploadImageModalState } from '../interfaces/upload-image-modal-state';
import { ImageService } from '../../shared/services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  isVisible = false;
  isMobile: boolean;
  payload: PayloadData;
  username: string;
  user: User;
  isLoggedInUser: boolean;
  followingUser: boolean;

  avatarUrl: string;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private imageService: ImageService,
    private activatedRoute: ActivatedRoute,
    private applicationStateService: ApplicationStateService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.avatarUrl = this.imageService.getDefaultProfileImage();
    this.payload = this.tokenService.getPayload();
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.username = this.activatedRoute.snapshot.params.username;
    if (!this.username) {
      this.username = this.payload.username;
      this.isLoggedInUser = true;
    } else if (this.payload.username === this.activatedRoute.snapshot.params.username) {
      this.isLoggedInUser = true;
    } else {
      this.isLoggedInUser = false;
    }
  }

  ngAfterViewInit() {
    this.getUser();
    this.userService.receiveNewFollowSocket().subscribe(() => {
      this.getUser();
    });
  }

  /**
   * popover that indicates upload image feature
   */
  uploadImagePopoverStr(): string {
    if (this.isLoggedInUser) {
      return 'Upload Image';
    }
  }

  /**
   * lets logged in user upload profile image on their profile page
   * sets isVisible status for upload-image-modal to true
   */
  uploadProfileImage(): void {
    if (this.isLoggedInUser) {
      this.isVisible = true;
    }
  }

  /**
   * emits the avatar url and modal visible status
   * from the upload-image-modal component
   * @param event updated image modal state
   */
  profileUpdated(event: UploadImageModalState) {
    this.avatarUrl = event.avatarUrl;
    this.isVisible = event.isVisible;
  }

  /**
   * follows selected user
   * @param userId follow request user id
   */
  followUser(userId: string) {
    const userInFollowingArray = this.checkUserInFollowingArray(this.user.followers, userId);
    if (!userInFollowingArray) {
      this.userService.followUser(this.user._id).subscribe((followingUserId: string) => {
        this.userService.emitNewFollowSocket();
        this.displayNotification('success', 'following user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    } else {
      this.userService.unFollowUser(this.user._id).subscribe((unFollowedUserId: string) => {
        this.userService.emitNewFollowSocket();
        this.displayNotification('warning', 'unfollowing user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    }
  }

  /**
   * uses lodash to check if the user id is in the logged in users following array
   * @param array array of followed users
   * @param userId users id
   */
  checkUserInFollowingArray(array: UserFollowing[], userId: string) {
    return _.find(array, [ 'userFollower._id', userId ]);
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
   * @param array array of usernames
   * @param username user
   */
  checkUserInArray(array: any[], username: string) {
    return _.some(array, { username });
  }

  /**
   * gets user and populates their profile image & posts
   */
  private getUser() {
    this.userService.getUserByUsername(this.username).subscribe((user: User) => {
      this.user = user;

      if (!this.user.picId) {
        this.avatarUrl = this.imageService.getDefaultProfileImage();
      } else {
        this.avatarUrl = this.imageService.getImage(this.user.picVersion, this.user.picId);
      }

      if (this.checkUserInFollowingArray(this.user.followers, this.payload._id)) {
        this.followingUser = true;
      } else {
        this.followingUser = false;
      }
    });
  }
}
