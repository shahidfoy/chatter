import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Post, UserComment } from '../../interfaces/post.interface';
import { timeFromNow } from 'src/app/shared/shared.utils';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  isLoading = false;
  commentForm: FormGroup;
  postId: string;
  post: Post;
  commentsArray: UserComment[];

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });

    this.getPost();
    this.postService.receiveNewCommentSocket().subscribe(() => {
      this.getPost();
    });
  }

  // TODO:: limit comment length

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
