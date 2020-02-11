import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { ImageService } from '../../services/image.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-edit-modal',
  templateUrl: './post-edit-modal.component.html',
  styleUrls: ['./post-edit-modal.component.scss']
})
export class PostEditModalComponent implements OnInit, OnChanges {

  @Input() isVisible: boolean;
  @Input() post: Post;
  @Output() newPostOutput = new EventEmitter<any>();

  selectedTags: string[] = ['test', 'testing'];

  constructor(private imageService: ImageService, private postService: PostService) { }

  ngOnInit() {
    // this.getPost();
  }

  ngOnChanges() {
    console.log('post', this.post);
    this.selectedTags = this.post.tags;
    console.log('selected', this.selectedTags);
    this.getPost();
  }

  /**
   * closes model when ok button is clicked
   * updates users profile image
   */
  handleModalOk() {
    this.isVisible = false;
    this.newPostOutput.emit();
  }

  /**
   * closes model when user clicks away from modal
   * updates users profile image
   */
  handleModalCancel() {
    this.isVisible = false;
    this.newPostOutput.emit();
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

  private getPost() {
    this.postService.getPost(this.post._id).subscribe((post: Post) => {
      this.post = post;
      this.selectedTags = post.tags;
    });
  }
}
