import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post, UserComment } from '../../interfaces/post.interface';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { User } from 'src/app/shared/interfaces/user.interface';
import { ImageService } from '../../../shared/services/image.service';
import { ApplicationStateService } from 'src/app/shared/services/application-state.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { PayloadData } from 'src/app/shared/interfaces/jwt-payload.interface';
import { NzNotificationService } from 'ng-zorro-antd';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  private readonly MAX_CHARS: number = 300;

  @Input() postId: string;

  isMobile: boolean;
  payload: PayloadData;
  commentForm: FormGroup;
  post: Post;
  postImage = '';
  commentsArray: UserComment[];
  charCount = this.MAX_CHARS;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private imageService: ImageService,
    private applicationStateService: ApplicationStateService,
    private activatedRoute: ActivatedRoute,
    private notification: NzNotificationService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.payload = this.tokenService.getPayload();
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });

    this.getPost();
    this.postService.receiveNewCommentSocket().subscribe(() => {
      this.getPost();
    });
  }

  /**
   * gets user's avatar
   * @param user user
   */
  getUserAvatar(user: User): string {
    if (user && user.picId) {
      return this.imageService.getImage(user.picVersion, user.picId);
    } else {
      return this.imageService.getDefaultProfileImage();
    }
  }

  /**
   * adds a new comment to post
   */
  addNewComment() {
    this.postService.addComment(this.postId, this.post.user._id, this.commentForm.value.comment).subscribe(() => {
      this.commentForm.reset();
      this.postService.emitNewCommentSocket();
    });
  }

  /**
   * checks comment character length
   * @param commentValue post value
   */
  checkCharLength(commentValue: string) {
    this.charCount = this.MAX_CHARS;
    this.charCount -= commentValue.length;
  }

  /**
   * uses moment to customize time output
   * @param time time stamp
   */
  timeFromNow(time: Date) {
    return timeFromNow(time);
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
   * add like to a post
   * @param post post being liked
   */
  like(post: Post) {
    const isInLikeArray = this.checkUserInArray(post.likes, this.payload.username);
    if (!isInLikeArray) {
      this.postService.addLike(post).subscribe((postId: string) => {
        this.postService.emitNewCommentSocket();
      }, (err: HttpErrorResponse) => {
        this.displayError(err.error.message);
      });
    }
  }

  /**
   * add dislike to a post
   * @param post post being disliked
   */
  dislike(post: Post) {
    const isInDislikeArray = this.checkUserInArray(post.dislikes, this.payload.username);
    if (!isInDislikeArray) {
      this.postService.addDislike(post).subscribe((postId: string) => {
        this.postService.emitNewCommentSocket();
      }, (err: HttpErrorResponse) => {
        this.displayError(err.error.message);
      });
    }
  }


  /**
   * gets post by post id
   */
  private getPost() {
    this.postService.getPost(this.postId).subscribe((post: Post) => {
      this.post = post;
      if (this.post.picId) {
        this.postImage = this.imageService.getImage(this.post.picVersion, this.post.picId);
      } else {
        this.postImage = '';
      }
      this.commentsArray = post.comments.reverse();
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
