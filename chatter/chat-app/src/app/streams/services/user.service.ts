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

  /**
   * gets user by id
   * @param userId user's id
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.BASEURL}/api/users/id/${userId}`);
  }

  /**
   * gets user by username
   * @param username user's username
   */
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.BASEURL}/api/users/username/${username}`);
  }

  /**
   * follows selected user
   * @param followUserId requested user id to follow
   */
  followUser(followUserId: string): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/users/follow-user`, {
      followUserId
    });
  }
}
