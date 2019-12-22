import { Component, OnInit } from '@angular/core';
import { ApplicationStateService } from 'src/app/services/application-state.service';
import { distanceInWords } from 'date-fns';
import { PostService } from '../services/post.service';
import { Post, UsernameObj } from 'src/app/interfaces/post.interface';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { PayloadData } from 'src/app/interfaces/jwt-payload.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  isMobile: boolean;
  payload: PayloadData;
  username: string;
  posts: Post[];
  dislikes = 0;
  time = distanceInWords(new Date(), new Date());

  constructor(
    private tokenService: TokenService,
    private applicationStateService: ApplicationStateService,
    private postService: PostService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.username = this.payload.username;
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.getAllPosts();
    this.postService.receiveNewPostSocket().subscribe(() => {
      this.getAllPosts();
    });
  }

  /**
   * uses moment to customize time output
   * @param time time stamp
   */
  timeFromNow(time: Date) {
    return moment(time).fromNow();
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
   * check if the user is in the likes array
   * @param likesArray array of likes
   * @param username user who liked post
   */
  checkUserInLikesArray(likesArray: UsernameObj[], username: string) {
    return _.some(likesArray, { username });
  }

  /**
   * check if the user is in the dislikes array
   * @param dislikesArray array of dislikes
   * @param username user who disliked post
   */
  checkUserInDislikesArray(dislikesArray: UsernameObj[], username: string) {
    return _.some(dislikesArray, { username });
  }

  /**
   * gets all posts
   */
  private getAllPosts() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  /**
   * displays error
   * @param message error message
   */
  private displayError(message: string) {
    this.notification.create('warning', 'unable to like post', message);
  }
}
