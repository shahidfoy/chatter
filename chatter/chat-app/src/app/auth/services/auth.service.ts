import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../../shared/interfaces/tokenResponse.interface';
import { User } from '../../shared/interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { ChangePassword } from '../../shared/interfaces/change-password.interface';
import { MessageResponse } from 'src/app/shared/interfaces/message-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  /**
   * registers new user
   * @param body user contents
   */
  resgisterUser(body: User): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.BASEURL}/api/auth/register`, body);
  }

  /**
   * logs in user
   * @param body partial user contents
   */
  loginUser(body: Partial<User>): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.BASEURL}/api/auth/login`, body);
  }

  /**
   * logs user out
   * @param id user id
   */
  logoutUser(id: string): Observable<void> {
    return this.http.post<void>(`${environment.BASEURL}/api/auth/logout`, { id });
  }

  /**
   * changes user's password
   * @param body password contents
   */
  changePassword(body: ChangePassword): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.BASEURL}/api/auth/change-password`, body);
  }
}
