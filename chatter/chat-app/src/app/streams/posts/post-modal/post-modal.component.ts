import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { ImageService } from '../../../shared/services/image.service';
import { PostService } from '../../services/post.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CloudinaryResponse } from '../../interfaces/cloudinary-response';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss']
})
export class PostModalComponent implements OnInit, OnChanges {

  FILE_UPLOAD_URL = `${environment.BASEURL}/api/images/upload-post-image`;

  @Input() isVisible: boolean;
  @Input() editPostAction: boolean;
  @Input() post: Post;
  @Output() newPostOutput = new EventEmitter<void>();

  private readonly BACKSPACE: string = 'Backspace';
  private readonly ENTER: string = 'Enter';

  postForm: FormGroup;
  loading: boolean;
  postImage = '';
  imageCount = 0;

  constructor(
    private fb: FormBuilder,
    private imageService: ImageService,
    private postService: PostService,
    private notification: NzNotificationService) { }

  ngOnInit() {}

  ngOnChanges() {
    this.postForm = this.fb.group({
      postId: this.post._id,
      post: [this.post.post, Validators.required],
      tags: [this.post.tags],
      picVersion: [this.post.picVersion],
      picId: [this.post.picId],
    });
    this.getPost();

    if (this.post.picId) {
      this.postImage = this.imageService.getImage(this.post.picVersion, this.post.picId);
    } else {
      this.postImage = '';
    }
  }

  /**
   * submits users post
   * if image updated adds image to post form
   */
  submitPost() {
    if (this.postImage !== '') {
      this.imageService.editPostImage(this.post, this.postImage).subscribe((result: CloudinaryResponse) => {
        this.postForm.controls.picVersion.setValue(result.version);
        this.postForm.controls.picId.setValue(result.public_id);
        this.updatePost();
      });
    } else {
      this.updatePost();
    }
  }

  /**
   * updates post through post service
   */
  updatePost() {
    this.postService.editPost(this.postForm.value).subscribe((data: Post) => {
      this.displaySuccess('updating post!');
      window.location.reload();
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
    });
  }

  /**
   * closes model when ok button is clicked
   * updates users profile image
   */
  handleModalOk() {
    this.submitPost();
    this.isVisible = false;
    this.newPostOutput.emit();
  }

  /**
   * deletes post
   */
  handleDeletePost() {
    if (this.post.picId) {
      this.imageService
        .deletePostImage(this.post.picId)
        .subscribe(() => {}, (err: Error) => this.displayError(err.message));
    }
    this.postService
      .deletePost(this.post._id)
      .subscribe(() => {
        this.displaySuccess('post has been deleted');
        setTimeout(() => {
          window.location.reload();
          this.handleModalCancel();
        }, 1000);
      }, (err: Error) => this.displayError(err.message));
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
   * gets keyboard event and updates post message
   */
  editPost(event: KeyboardEvent) {
    console.log('EVENT', event);
    const regexPost = /[0-9]*[^0-9]*/g;
    if (event.key === this.BACKSPACE) {
      this.post.post = this.post.post.substring(0, this.post.post.length - 1);
    } else if (event.key === this.ENTER) {
      this.post.post += '\n';
    } else {
      if (regexPost.test(event.key)) {
        this.post.post += event.key;
        console.log('post', this.post.post);
      }
    }
  }

  /**
   * checks requirements before image upload
   */
  beforeUpload = (file: File): any => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';

      // check file type
      if (!isJPG && !isPNG && !isGIF) {
        this.displayError('You can only upload JPG, PND or GIF files!');
        observer.complete();
        return;
      }

      // check file size
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.displayError('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.imageService.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.displayError('Only images above 300x300');
          observer.complete();
          return;
        }

        if (isJPG) { return observer.next(isJPG && isLt2M && dimensionRes); }
        if (isPNG) { return observer.next(isPNG && isLt2M && dimensionRes); }
        if (isGIF) { return observer.next(isGIF && isLt2M && dimensionRes); }
        observer.complete();
      });
    });
  }

  /**
   * handles image uploading process
   * @param info image file info
   */
  handlePostImageChange(info: any) {
    this.imageCount = info.fileList.length;
    switch (info.file.status) {
      case 'uploading':
        console.log('UPLOADING');
        break;
      case 'done':
        console.log('DONE');
        this.imageService.beforeUpload(info.file.originFileObj).subscribe((uploadResult) => {
          if (uploadResult) {
            this.imageService.getBase64(info.file.originFileObj, (img: string) => {
              this.postImage = img;
            });
          }
        });
        break;
      case 'error':
        this.notification.create('warning', 'Network error', 'unable to upload image');
        break;
    }
  }

  /**
   * gets selected post
   */
  private getPost() {
    this.postService.getPost(this.post._id).subscribe((post: Post) => {
      this.post = post;
    });
  }

  /**
   * displays error message
   * @param message error message
   */
  private displaySuccess(message: string) {
    this.notification.create('success', 'Success', message);
  }

  /**
   * displays error message
   * @param message error message
   */
  private displayError(message: string) {
    this.notification.create('warning', 'unable to edit post', message);
  }
}
