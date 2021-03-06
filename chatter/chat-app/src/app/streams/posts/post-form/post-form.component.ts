import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd';
import { ImageService } from '../../../shared/services/image.service';
import { Observable, Observer } from 'rxjs';
import { CloudinaryResponse } from '../../interfaces/cloudinary-response';
import { environment } from 'src/environments/environment';
import { PayloadData } from 'src/app/shared/interfaces/jwt-payload.interface';
import { TokenService } from 'src/app/shared/services/token.service';
import { GroupsService } from '../../services/groups.service';
import { Tag } from '../../interfaces/tag.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  private readonly MAX_CHARS: number = 300;

  FILE_UPLOAD_URL = `${environment.BASEURL}/api/images/upload-post-image`;
  postForm: FormGroup;
  @Input() isMobile: boolean;

  loggedInUser: PayloadData;
  inputValue = '';
  postImage = '';
  imageCount = 0;
  charCount = this.MAX_CHARS;
  submitting = false;
  isLoading = false;
  allowedTags: string[];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private imageService: ImageService,
    private groupsService: GroupsService,
    private notification: NzNotificationService,
    private tokenService: TokenService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.postForm = this.fb.group({
      post: ['', Validators.required],
      tags: [],
      picVersion: [''],
      picId: [''],
    });

    this.route.params.subscribe(params => { 
      this.allowedTags = [];
      this.allowedTags.push(params.group);
      this.postForm.controls.tags.setValue(this.allowedTags);
    });

    this.loggedInUser = this.tokenService.getPayload();

    // Possibily add later
    // this.groupsService.getTags().subscribe((tags: Tag[]) => {
    //   this.allowedTags = tags.map((tag: Tag) => tag.tag);
    //   this.postForm.controls.tags.setValue(this.allowedTags); 
    // });
  }

  /**
   * submits users post
   */
  submitPost() {
    this.isLoading = true;

    if (this.postImage !== '') {
      this.imageService.uploadPostImage(this.postImage).subscribe((result: CloudinaryResponse) => {
        this.postForm.controls.picVersion.setValue(result.version);
        this.postForm.controls.picId.setValue(result.public_id);
        this.addPost();
      });
    } else {
      this.addPost();
    }

  }

  /**
   * adds post through post service
   */
  addPost() {
    const postText = this.postForm.value.post;
    this.postService.addPost(this.postForm.value).subscribe((data: Post) => {
      this.postForm.reset();
      this.isLoading = false;

      if (data.username === this.loggedInUser.username) {
        window.location.reload();
        // this.postService.emitNewPostSocket();
      }
    }, (err: HttpErrorResponse) => {
      this.displayError(err.error.message);
      this.isLoading = false;
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
   * checks posts character length
   * @param postValue post value
   */
  checkCharLength(postValue: string) {
    this.charCount = this.MAX_CHARS;
    this.charCount -= postValue.length;
  }

  /**
   * displays error message
   * @param message error message
   */
  private displayError(message: string) {
    this.notification.create('warning', 'unable to post', message);
  }
}
