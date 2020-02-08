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
  processFile = false;

  constructor(
    private msg: NzMessageService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
  }

  /**
   * emits users upated image and sends image data to profile component parent
   */
  updateProfile() {
    this.imageService.emitUserProfileImage(this.avatarUrl);
    this.updateProfileOutput.emit({
      avatarUrl: this.avatarUrl,
      isVisible: this.isVisible,
    });
  }

  /**
   * closes model when ok button is clicked
   * updates users profile image
   */
  handleModalOk() {
    this.isVisible = false;
    this.updateProfile();
  }

  /**
   * closes model when user clicks away from modal
   * updates users profile image
   */
  handleModalCancel() {
    this.isVisible = false;
    this.updateProfile();
  }

  /**
   * handles image file status changes
   * @param info image file info
   */
  handleChange(info: { file: UploadFile }) {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // uploads profile image
        this.imageService.beforeUpload(info.file.originFileObj).subscribe((result) => {
          if (result) {
            this.imageService.getBase64(info.file.originFileObj, (img: string) => {
              this.loading = false;
              this.avatarUrl = img.toString();
              // image service
              this.imageService.uploadImage(img).subscribe((response: CloudinaryResponse) => {});
            });
          }
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
