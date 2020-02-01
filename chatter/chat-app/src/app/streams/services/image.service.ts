import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CloudinaryResponse } from '../interfaces/cloudinary-response';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  /**
   * uploads user's profile image
   * @param image profile image
   */
  uploadImage(image: string): Observable<CloudinaryResponse> {
    return this.http.post<CloudinaryResponse>(`${environment.BASEURL}/api/images/upload-profile-image`, { image });
  }
}
