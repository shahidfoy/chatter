import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../app/interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * gets all users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.BASEURL}/api/users`);
  }

  followUser(followUserId: string): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/users/follow-user`, {
      followUserId
    });
  }
}
