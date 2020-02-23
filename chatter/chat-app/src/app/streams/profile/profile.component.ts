import { Component, OnInit } from '@angular/core';
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
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isVisible = false;
  isMobile: boolean;
  payload: PayloadData;
  username: string;
  user: User;
  following: UserFollowing[];
  followersCount: number;
  followingCount: number;
  isLoggedInUser: boolean;
  followingUser: boolean;

  avatarUrl: string;

  constructor(
    private userService: UserService,
    private contactService: ContactService,
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

    this.getUser();
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
  followUser() {
    if (!this.followingUser) {
      this.contactService.followUser(this.user._id).subscribe((followingUserId: string) => {
        this.followingUser = true;
        this.displayNotification('success', 'following user');
      }, err => {
        this.displayNotification('error', err.error.message);
      });
    } else {
      this.contactService.unFollowUser(this.user._id).subscribe((unFollowedUserId: string) => {
        this.followingUser = false;
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

      this.contactService.getUserFollowersCount(user._id).subscribe((followersCount: number) => this.followersCount = followersCount);
      this.contactService.getUserFollowingCount(user._id).subscribe((followingCount: number) => this.followingCount = followingCount);
      this.contactService.checkUserFollowing(this.payload._id, user._id).subscribe((result: boolean) => {
        this.followingUser = result;
      });
    });
  }
}
