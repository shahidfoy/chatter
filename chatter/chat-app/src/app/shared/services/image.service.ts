import { Injectable } from '@angular/core';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CloudinaryResponse } from '../../streams/interfaces/cloudinary-response';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Post } from '../../streams/interfaces/post.interface';

/**
 * Retrieves the REST endpoints for images
 * sets users profile image
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly DEFAULT_PROFILE_IMAGE = environment.CLOUDINARY_BASE_URL + '/v1584037334/FullColor_IconOnly_1280x1024_72dpi_repjh0.jpg';
  profileImageSubject = new Subject<string>();

  constructor(
    private http: HttpClient,
    private msg: NzMessageService,
  ) { }

  /**
   * uploads user's profile image
   * @param image profile image
   */
  uploadImage(image: string): Observable<CloudinaryResponse> {
    return this.http.post<CloudinaryResponse>(`${environment.BASEURL}/api/images/upload-profile-image`, { image });
  }

  /**
   * uploads image for post
   * @param postImage post image
   */
  uploadPostImage(postImage: string): Observable<CloudinaryResponse> {
    return this.http.post<CloudinaryResponse>(`${environment.BASEURL}/api/images/upload-post-image`, { postImage });
  }

  /**
   * edit image for post deletes old photo
   * @param post post being edited
   * @param postImage post image
   */
  editPostImage(post: Post, postImage: string): Observable<CloudinaryResponse> {
    return this.http.post<CloudinaryResponse>(`${environment.BASEURL}/api/images/edit-post-image`, { post, postImage });
  }

  /**
   * deletes post's image
   * @param picId posts pic id
   */
  deletePostImage(picId: string): Observable<void> {
    return this.http.delete<void>(`${environment.BASEURL}/api/images/delete-post-image/${picId}`);
  }

  /**
   * gets default profile image
   */
  getDefaultProfileImage(): string {
    return this.DEFAULT_PROFILE_IMAGE;
  }

  /**
   * gets cloudinary image
   * @param picVersion cloudinary pic version
   * @param picId cloudinary pid id
   */
  getImage(picVersion: string, picId: string): string {
    return `${environment.CLOUDINARY_BASE_URL}/v${picVersion}/${picId}`;
  }

  /**
   * emits user profile image
   * @param imageUrl user profile image
   */
  emitUserProfileImage(imageUrl: string) {
    this.profileImageSubject.next(imageUrl);
  }

  /**
   * verifies image requirements
   */
  beforeUpload(file: File): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';

      // check file type
      if (!isJPG && !isPNG && !isGIF) {
        this.msg.error('You can only upload JPG, PND or GIF files!');
        observer.complete();
        return;
      }

      // check file size
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Only images above 300x300');
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
   * converts file to string base64
   * @param img image file
   * @param callback result of file reader
   */
  getBase64(img: File, callback: (img: ArrayBuffer | string) => void): any {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      callback(reader.result);
    });

    reader.addEventListener('error', (event) => {
      this.msg.error(`Network Error ${event}`);
    });
    reader.readAsDataURL(img);
  }

  /**
   * check image dimensions
   * loads images whos width and height are
   * greator then or equal to 300 x 300
   * @param file incoming image file
   */
  checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        resolve(width >= 300 && height >= 300);
      };
    });
  }
}
