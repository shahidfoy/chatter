import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicationStateService } from '../../shared/services/application-state.service';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { User } from 'src/app/shared/interfaces/user.interface';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterViewInit {

  private readonly PATH_PROFILE = 'profile';
  isMobile: boolean;
  payload: PayloadData;
  username: string;
  posts: Post[];
  userData: User;
  editPost: Post;

  updateMasonry = false;
  isLoggedInUser = false;
  editUserPost = false;
  isPostVisible = false;

  constructor(
    private tokenService: TokenService,
    private applicationStateService: ApplicationStateService,
    private postService: PostService,
    private imageService: ImageService,
    private userService: UserService,
    private notification: NzNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.username = this.payload.username;
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  ngAfterViewInit() {
    this.setUpPosts();

    this.imageService.profileImageSubject.subscribe(() => {
      this.setUpPosts();
    });
  }

  /**
   * gets users profile image url
   * @param user user of post
   */
  getAvatarUrl(user: User) {
    const snapshotRootPath = this.activatedRoute.snapshot.url[0].path;
    if (snapshotRootPath === this.PATH_PROFILE) {
      return this.setImage(this.userData.picVersion, this.userData.picId);
    } else {
      return this.setImage(user.picVersion, user.picId);
    }
  }

  /**
   * checkes to see if post belongs to logged in user
   * @param username post's username
   */
  isloggedInUsersPost(username: string): boolean {
    return this.payload.username === username ? true : false;
  }

  openEditPostModal(post: Post) {
    this.editPost = post;
    this.isPostVisible = true;
    this.editUserPost = true;
  }

  updatePost() {
    this.isPostVisible = false;
    this.editUserPost = false;
  }

  /**
   * open comments for post
   * @param post post comments
   */
  openComments(post: Post) {
    // this.router.navigate(['streams/post', post._id]);
    this.editPost = post;
    this.isPostVisible = true;
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
   * sets up which posts will be displayed
   * gets all posts or gets a users posts
   */
  setUpPosts() {
    if (this.activatedRoute.snapshot.url[0].path === this.PATH_PROFILE) {
      const pathUsername = this.activatedRoute.snapshot.url[1];
      if (pathUsername) {
        this.getUser(pathUsername.path);
      } else {
        this.getUser(this.username);
      }
    } else {
      this.getAllPosts();
    }
  }

  /**
   * gets all posts
   */
  private getAllPosts() {
    if (this.isMobile) {
        this.postService.getPosts().subscribe(posts => {
          setTimeout(() => {
            this.posts = posts;
          }, 500);
        });
    } else {
      this.postService.getPosts().subscribe(posts => {
        this.posts = posts;
      });
    }

    setTimeout(() => {
      this.updateMasonry = true;
    }, 1000);
  }

  /**
   * gets user and populates their posts
   */
  private getUser(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.posts = [];
      this.userData = user;
      this.posts = user.posts.map(post => post.postId as Post);
      this.posts.sort((current, next) => {
        return +new Date(next.createdAt) - +new Date(current.createdAt);
      });
      setTimeout(() => {
        this.updateMasonry = true;
      }, 1000);
    });
  }

  /**
   * sets users image
   * @param picVersion user pic version
   * @param picId user pic id
   */
  private setImage(picVersion: string, picId: string): string {
    if (picId) {
      return this.imageService.getImage(picVersion, picId);
    } else {
      return this.imageService.getDefaultProfileImage();
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
