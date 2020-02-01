import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CloudinaryResponse } from '../interfaces/cloudinary-response';

/**
 * Retrieves the REST endpoints for images
 * sets users profile image
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly DEFAULT_PROFILE_IMAGE = environment.CLOUDINARY_BASE_URL + '/v1580522418/little-fox_dribbble_mdr97t.png';

  constructor(private http: HttpClient) { }

  /**
   * uploads user's profile image
   * @param image profile image
   */
  uploadImage(image: string): Observable<CloudinaryResponse> {
    return this.http.post<CloudinaryResponse>(`${environment.BASEURL}/api/images/upload-profile-image`, { image });
  }

  /**
   * gets default profile image
   */
  getDefaultProfileImage() {
    return this.DEFAULT_PROFILE_IMAGE;
  }

  /**
   * gets users profile image
   * @param picVersion user cloudinary pic version
   * @param picId user cloudinary pid id
   */
  getUserProfileImage(picVersion: string, picId: string) {
    return `${environment.CLOUDINARY_BASE_URL}/v${picVersion}/${picId}`;
  }
}
