import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { PayloadData } from '../../interfaces/jwt-payload.interface';
import { User } from '../../interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationStateService } from 'src/app/services/application-state.service';
import { UserService } from '../services/user.service';
import { Post } from '../interfaces/post.interface';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from '../services/post.service';
import * as _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isMobile: boolean;
  payload: PayloadData;
  username: string;
  posts: Post[];
  user: User;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private applicationStateService: ApplicationStateService,
    private notification: NzNotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.username = this.activatedRoute.snapshot.params.username;
    if (!this.username) {
      this.payload = this.tokenService.getPayload();
      this.username = this.payload.username;
    }

    this.getUser();

    this.postService.receiveNewPostSocket().subscribe(() => {
      this.getUser();
    });
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
    });
  }
}
