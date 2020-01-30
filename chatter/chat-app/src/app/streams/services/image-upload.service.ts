import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  uploadImage(image: any): Observable<any> {
    console.log('uploading PROFILE IMAGE', image);
    return this.http.post<any>(`${environment.BASEURL}/api/images/upload-profile-image`, { image });
  }
}
