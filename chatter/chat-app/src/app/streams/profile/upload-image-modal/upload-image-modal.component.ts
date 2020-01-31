import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { UploadImageModalState } from '../../interfaces/upload-image-modal-state';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-upload-image-modal',
  templateUrl: './upload-image-modal.component.html',
  styleUrls: ['./upload-image-modal.component.scss']
})
export class UploadImageModalComponent implements OnInit {

  FILE_UPLOAD_URL = `${environment.BASEURL}/api/images/upload-profile-image`;

  uploader: FileUploader = new FileUploader({
    url: this.FILE_UPLOAD_URL,
    disableMultipart: true,
  });

  @Input() avatarUrl: string;
  @Input() isVisible: boolean;
  @Output() updateProfileOutput = new EventEmitter<UploadImageModalState>();
  loading = false;

  constructor(
    private msg: NzMessageService,
    private imageUploadService: ImageUploadService
  ) { }

  ngOnInit() {
  }

    // TODO:: CURRENTLY HERE
  updateProfile() {
    this.updateProfileOutput.emit({
      avatarUrl: this.avatarUrl,
      isVisible: this.isVisible,
    });
  }

  handleModalOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.updateProfile();
  }

  handleModalCancel(): void {
    console.log('Button cancel clicked!');
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

  handleChange(info: { file: UploadFile }): void {
    console.log('upload image info', info);
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        console.log('DONE');
        this.getBase64(info.file.originFileObj, (img: string) => {
          console.log('img', img);
          this.loading = false;
          this.avatarUrl = img.toString();

          this.imageUploadService.uploadImage(img).subscribe((response: any) => {
            console.log('uploading image complete', response);
          });
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }


  private getBase64(img: File, callback: (img: any) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      // console.log('reader result', reader.result.toString());
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
