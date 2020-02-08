import { Component, OnInit } from '@angular/core';
import { ApplicationStateService } from '../../shared/services/application-state.service';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { User } from 'src/app/shared/interfaces/user.interface';
import { ImageService } from '../services/image.service';

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

  constructor(
    private tokenService: TokenService,
    private applicationStateService: ApplicationStateService,
    private postService: PostService,
    private imageService: ImageService,
    private notification: NzNotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.username = this.payload.username;
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.getAllPosts();
    // this.postService.receiveNewPostSocket().subscribe(() => {
    //   setTimeout(() => {
    //     this.getAllPosts();
    //   }, 500);
    // });
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
      let userLiked = false;
      post.likes.forEach(like => {
        if (like.username === this.payload.username) {
          userLiked = true;
        }
      });
      let userDisliked = false;
      post.dislikes.forEach(dislike => {
        if (dislike.username === this.payload.username) {
          userDisliked = true;
        }
      });

      if (!userLiked) {
        post.likes.push({
          _id: '0',
          username: this.payload.username
        });
        post.dislikes = post.dislikes.filter((dislike) => dislike.username !== this.payload.username);
        post.totalLikes += 1;
        if (post.totalDislikes > 0 && userDisliked) {
          post.totalDislikes -= 1;
        }
      }
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
      let userLiked = false;
      post.likes.forEach(like => {
        if (like.username === this.payload.username) {
          userLiked = true;
        }
      });
      let userDisliked = false;
      post.dislikes.forEach(dislike => {
        if (dislike.username === this.payload.username) {
          userDisliked = true;
        }
      });

      if (!userDisliked) {
        post.dislikes.push({
          _id: '0',
          username: this.payload.username
        });
        post.likes = post.likes.filter((like) => like.username !== this.payload.username);
        post.totalDislikes += 1;
        if (post.totalLikes > 0 && userLiked) {
          post.totalLikes -= 1;
        }
      }
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
   * gets post image
   * @param post post contents
   */
  getPostImage(post: Post): string {
    if (post.picId) {
      return this.imageService.getImage(post.picVersion, post.picId);
    }
    return '';
  }

  /**
   * gets all posts
   */
  private getAllPosts() {
    if (this.isMobile) {
      setTimeout(() => {
        this.postService.getPosts().subscribe(posts => {
          this.posts = posts;
        });
      }, 500);
    } else {
      this.postService.getPosts().subscribe(posts => {
        this.posts = posts;
      });
    }
  }

  /**
   * displays error
   * @param message error message
   */
  private displayError(message: string) {
    this.notification.create('warning', 'unable to like post', message);
  }
}
