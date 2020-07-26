import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicationStateService } from '../../shared/services/application-state.service';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { TokenService } from '../../shared/services/token.service';
import { PayloadData } from '../../shared/interfaces/jwt-payload.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { timeFromNow } from '../../shared/shared.utils';
import { User } from '../../shared/interfaces/user.interface';
import { ImageService } from '../../shared/services/image.service';
import { UserService } from '../services/user.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterViewInit {

  private readonly PATH_PROFILE = 'profile';
  private readonly PATH_TRENDING = 'trending';
  private readonly LIMIT = 15;
  private PAGE = 0;

  isMobile: boolean;
  payload: PayloadData;
  username: string;
  posts: Post[] = [];
  userData: User;
  editPost: Post;

  isLoading = true;
  paginateMorePosts = true;
  updateMasonry = false;
  isLoggedInUser = false;
  isPostVisible = false;
  isTrending = false;
  selectedGroup: string;

  constructor(
    private tokenService: TokenService,
    private applicationStateService: ApplicationStateService,
    private notificationsService: NotificationsService,
    private postService: PostService,
    private imageService: ImageService,
    private userService: UserService,
    private notification: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.username = this.payload.username;
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.activatedRoute.params.subscribe(params => { 
      this.selectedGroup = params.group;
      this.setUpPosts();
    });
  }

  ngAfterViewInit() {
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

  /**
   * opens edit post modal
   * @param post selected post
   */
  openEditPostModal(post: Post) {
    this.editPost = post;
    this.isPostVisible = true;
  }

  /**
   * hides post modal
   */
  hidePost() {
    this.isPostVisible = false;
  }

  /**
   * open comments for post
   * @param post post comments
   */
  openComments(post: Post) {
    this.router.navigate(['streams/post/comments', post._id]);
    // this.editPost = post;
    // this.isPostVisible = true;
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
    const isInLikedArray = this.checkUserInArray(post.likes, this.username);
    if (isInLikedArray) { return; }
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
      this.notificationsService.emitNewNotificationActionSocket();
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
    });
  }

  /**
   * add dislike to a post
   * @param post post being disliked
   */
  dislike(post: Post) {
    const isInDislikedArray = this.checkUserInArray(post.dislikes, this.username);
    if (isInDislikedArray) { return; }
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
   * loads more posts using pagination
   */
  loadMorePosts() {
    this.PAGE++;
    this.updateMasonry = false;
    if (this.paginateMorePosts) {
      switch (this.activatedRoute.snapshot.url[0].path) {
        case this.PATH_PROFILE:
          const pathUsername = this.activatedRoute.snapshot.url[1];
          if (pathUsername && pathUsername.path !== this.payload.username) {
            this.isLoggedInUser = false;
            this.getUser(pathUsername.path);
          } else {
            this.isLoggedInUser = true;
            this.getUser(this.username);
          }
          break;
        case this.PATH_TRENDING:
          this.postService.getTrendingPosts(this.PAGE).subscribe(posts => {
            if (posts.length < this.LIMIT) { this.paginateMorePosts = false; }
            this.posts = this.posts.concat(posts);
            this.isLoading = false;
            this.updateLayout();
          });
          break;
        default:
          this.isLoggedInUser = true;
          this.postService.getPosts(this.PAGE).subscribe(posts => {
            if (posts.length < this.LIMIT) { this.paginateMorePosts = false; }
            this.posts = this.posts.concat(posts);
            this.isLoading = false;
            this.updateLayout();
          });
          break;
      }
    }
  }

  /**
   * updates masonry layout
   */
  private updateLayout() {
    setTimeout(() => {
      this.updateMasonry = true;
    }, 1000);
  }

  /**
   * sets up which posts will be displayed
   * gets all posts or gets a users posts
   */
  private setUpPosts() {
    switch (this.activatedRoute.snapshot.url[0].path) {
      case this.PATH_PROFILE:
        const pathUsername = this.activatedRoute.snapshot.url[1];
        if (pathUsername && pathUsername.path !== this.payload.username) {
          this.isLoggedInUser = false;
          this.getUser(pathUsername.path);
        } else {
          this.isLoggedInUser = true;
          this.getUser(this.username);
        }
        break;
      case this.PATH_TRENDING:
        this.getTrendingPosts();
        break;
      default:
        this.isLoggedInUser = true;
        this.getAllPosts();
        break;
    }
  }

  /**
   * gets all posts
   */
  private getAllPosts() {
    if(this.selectedGroup) {
      this.postService.getPostsByTag(this.selectedGroup, this.PAGE).subscribe(postsByTag => {
        if (postsByTag.length < this.LIMIT) { this.paginateMorePosts = false }
        this.posts = postsByTag;
        // this.posts.forEach(post => { post.post = this.detectUrl(post.post) });
        console.log(this.posts);
        this.isLoading = false;
        this.updateLayout();
      });
    } else {
      this.postService.getPosts(this.PAGE).subscribe(posts => {
        if (posts.length < this.LIMIT) { this.paginateMorePosts = false; }
        this.posts = posts;
        this.isLoading = false;
        this.updateLayout();
      });
    }
  }

  private detectUrl(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, `<a href="$1" target="_blank">$1</a>`);
  }

  /**
   * gets user and populates their posts
   */
  private getUser(username: string) {
    this.userService.getUserByUsername(username).subscribe((user: User) => {
      this.userData = user;

      this.postService.getPostsByUserId(user._id, this.PAGE).subscribe((posts: Post[]) => {
        if (posts.length < this.LIMIT) { this.paginateMorePosts = false; }
        this.posts = this.posts.length < 1 ?  posts : this.posts.concat(posts);
        this.isLoading = false;
        this.updateLayout();
      });
    });
  }

  /**
   * gets trending posts
   */
  private getTrendingPosts() {
    this.isTrending = true;
    this.postService.getTrendingPosts(this.PAGE).subscribe(posts => {
      if (posts.length < this.LIMIT) { this.paginateMorePosts = false; }
      this.posts = posts;
      this.isLoading = false;
      this.updateLayout();
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
