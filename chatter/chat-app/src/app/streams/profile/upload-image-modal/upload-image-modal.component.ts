import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { UploadImageModalState } from '../../interfaces/upload-image-modal-state';
import { environment } from '../../../../environments/environment';
import { CloudinaryResponse } from '../../interfaces/cloudinary-response';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-upload-image-modal',
  templateUrl: './upload-image-modal.component.html',
  styleUrls: ['./upload-image-modal.component.scss']
})
export class UploadImageModalComponent implements OnInit {

  FILE_UPLOAD_URL = `${environment.BASEURL}/api/images/upload-profile-image`;

  @Input() avatarUrl: string;
  @Input() isVisible: boolean;
  @Output() updateProfileOutput = new EventEmitter<UploadImageModalState>();
  loading = false;

  constructor(
    private msg: NzMessageService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
  }

    // TODO:: CURRENTLY HERE add docs clean up code
  updateProfile() {
    this.imageService.emitUserProfileImage(this.avatarUrl);
    this.updateProfileOutput.emit({
      avatarUrl: this.avatarUrl,
      isVisible: this.isVisible,
    });
  }

  handleModalOk() {
    this.isVisible = false;
    this.updateProfile();
  }

  handleModalCancel() {
    this.isVisible = false;
    this.updateProfile();
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image only 300x300 above');
          observer.complete();
          return;
        }

        observer.next(isJPG && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  }

  handleChange(info: { file: UploadFile }) {

    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // uploads profile image
        this.getBase64(info.file.originFileObj, (img: string) => {
          this.loading = false;
          this.avatarUrl = img.toString();
          // image service
          this.imageService.uploadImage(img).subscribe((response: CloudinaryResponse) => {});
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }


  private getBase64(img: File, callback: (img: ArrayBuffer | string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      callback(reader.result);
    });

    reader.addEventListener('error', (event) => {
      this.msg.error(`Network Error ${event}`);
    });
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        resolve(width === height && width >= 300);
      };
    });
  }

}
