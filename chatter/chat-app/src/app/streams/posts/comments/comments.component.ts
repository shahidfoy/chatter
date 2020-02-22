import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post, UserComment } from '../../interfaces/post.interface';
import { timeFromNow } from 'src/app/shared/shared.utils';
import { User } from 'src/app/shared/interfaces/user.interface';
import { ImageService } from '../../../shared/services/image.service';
import { ApplicationStateService } from 'src/app/shared/services/application-state.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  private readonly MAX_CHARS: number = 300;

  @Input() postId: string;

  isMobile: boolean;
  commentForm: FormGroup;
  post: Post;
  commentsArray: UserComment[];
  charCount = this.MAX_CHARS;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private imageService: ImageService,
    private applicationStateService: ApplicationStateService,
  ) { }

  ngOnInit() {
    this.applicationStateService.isMobile.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    // this.postId = this.activatedRoute.snapshot.paramMap.get('id');
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
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(() => {
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
   * gets post by post id
   */
  private getPost() {
    this.postService.getPost(this.postId).subscribe((post: Post) => {
      this.post = post;
      this.commentsArray = post.comments.reverse();
    });
  }
}
