import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../../shared/interfaces/tokenResponse.interface';
import { User } from '../../shared/interfaces/user.interface';
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

  logoutUser(id: string): Observable<void> {
    return this.http.post<void>(`${environment.BASEURL}/api/auth/logout`, { id });
  }
}
