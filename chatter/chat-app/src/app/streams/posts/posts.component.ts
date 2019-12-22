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

  timeFromNow(time: Date) {
    return moment(time).fromNow();
  }

  like(post: Post) {
    this.postService.addLike(post).subscribe((postId: string) => {
      this.postService.emitNewPostSocket();
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
    });
  }

  dislike(post: Post) {
    this.postService.addDislike(post).subscribe((postId: string) => {
      this.postService.emitNewPostSocket();
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
    });
  }

  checkUserInLikesArray(likesArray: UsernameObj[], username: string) {
    return _.some(likesArray, { username });
  }

  checkUserInDislikesArray(dislikesArray: UsernameObj[], username: string) {
    return _.some(dislikesArray, { username });
  }

  private getAllPosts() {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  private displayError(message: string) {
    this.notification.create('warning', 'unable to like post', message);
  }
}
