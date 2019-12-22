import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../../interfaces/post.interface';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  postForm: FormGroup;
  @Input() isMobile: boolean;

  inputValue = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.postForm = this.fb.group({
      post: ['', Validators.required],
      tags: [],
    });
  }

  // TODO:: add and retrieve tags for posts
  // TODO:: add some form validations for post length and tags
  // TODO:: fix empty tag on enter bug
  // TODO:: limit tag length

  submitPost() {
    this.postService.addPost(this.postForm.value).subscribe((data: Post) => {
      this.postForm.reset();
      this.postService.emitNewPostSocket();
    });
  }
}
