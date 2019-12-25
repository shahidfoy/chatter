import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../../interfaces/tokenResponse.interface';
import { User } from '../../streams/interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  resgisterUser(body: User): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.BASEURL}/api/auth/register`, body);
  }

  loginUser(body: Partial<User>): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.BASEURL}/api/auth/login`, body);
  }
}
