import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { ImageService } from '../../services/image.service';
import { PostService } from '../../services/post.service';
import { UploadFile, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  @Output() newPostOutput = new EventEmitter<any>();

  selectedTags: string[];
  loading: boolean;
  postImage = '';
  imageCount = 0;

  constructor(
    private msg: NzMessageService,
    private imageService: ImageService,
    private postService: PostService,
    private notification: NzNotificationService) { }

  ngOnInit() {}

  ngOnChanges() {
    this.selectedTags = this.post.tags;
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
        break;
      case 'done':
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
   * displays error message
   * @param message error message
   */
  private displayError(message: string) {
    this.notification.create('warning', 'unable to post', message);
  }
}
