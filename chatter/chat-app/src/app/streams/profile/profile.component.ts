import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { User } from '../../shared/interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationStateService } from 'src/app/shared/services/application-state.service';
import { UserService } from '../services/user.service';
import { Post } from '../interfaces/post.interface';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from '../services/post.service';
import * as _ from 'lodash';
import { NzNotificationService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { UserFollowing } from '../interfaces/user-following.interface';
import { Observable, Observer } from 'rxjs';

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
  posts: Post[];
  user: User;
  isLoggedInUser: boolean;
  followingUser: boolean;

  loading = false;
  avatarUrl: string;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private applicationStateService: ApplicationStateService,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
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
    this.postService.receiveNewPostSocket().subscribe(() => {
      this.getUser();
    });
    this.userService.receiveNewFollowSocket().subscribe(() => {
      this.getUser();
    });
  }

  // TODO:: CURRENTLY HERE

  uploadProfileImage(username: string): void {
    console.log('username', username);
    this.isVisible = true;
  }

  handleModalOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleModalCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image only 300x300 above');
          observer.complete();
          return;
        }

        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width === height && width >= 300);
      };
    });
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
   * open comments for post
   * @param post post comments
   */
  openComments(post: Post) {
    this.router.navigate(['streams/post', post._id]);
  }

  /**
   * uses moment to customize time output
   * @param time time stamp
   */
  timeFromNow(time: Date) {
    return timeFromNow(time);
  }

  /**
   * add like to a post
   * @param post post being liked
   */
  like(post: Post) {
    this.postService.addLike(post).subscribe((postId: string) => {
      this.postService.emitNewPostSocket();
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
    });
  }

  /**
   * add dislike to a post
   * @param post post being disliked
   */
  dislike(post: Post) {
    this.postService.addDislike(post).subscribe((postId: string) => {
      this.postService.emitNewPostSocket();
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
    });
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
   * displays error
   * @param message error message
   */
  private displayError(message: string) {
    this.notification.create('warning', 'unable to update post', message);
  }

  /**
   * gets user and populates their posts
   */
  private getUser() {
    this.userService.getUserByUsername(this.username).subscribe((user: User) => {
      this.posts = [];
      this.user = user;

      this.posts = user.posts.map(post => post.postId as Post);
      this.posts.sort((current, next) => {
        return +new Date(next.createdAt) - +new Date(current.createdAt);
      });

      if (this.checkUserInFollowingArray(this.user.followers, this.payload._id)) {
        this.followingUser = true;
      } else {
        this.followingUser = false;
      }
    });
  }
}
