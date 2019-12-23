import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Post, UserComment } from '../../../../app/interfaces/post.interface';

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
  }

  // TODO:: limit comment length

  addNewComment() {
    console.log(this.commentForm.value);
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      console.log('comment data', data);
      this.commentForm.reset();
    });
  }

  private getPost() {
    this.postService.getPost(this.postId).subscribe((post: Post) => {
      console.log(post);
      this.post = post;
      this.commentsArray = post.comments;
    });
  }
}
