import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CloudinaryResponse } from '../interfaces/cloudinary-response';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  uploadImage(image: string): Observable<CloudinaryResponse> {
    console.log('uploading PROFILE IMAGE', image);
    return this.http.post<CloudinaryResponse>(`${environment.BASEURL}/api/images/upload-profile-image`, { image });
  }
}
