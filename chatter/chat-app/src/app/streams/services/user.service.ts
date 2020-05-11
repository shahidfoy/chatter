import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';
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
   * @param page pagination by page
   */
  getUsers(page: number = 0): Observable<User[]> {
    return this.http.get<User[]>(`${environment.BASEURL}/api/users/${page}`);
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
}
