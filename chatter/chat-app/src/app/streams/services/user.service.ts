import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, NotificationsObj } from '../../shared/interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly WEBSOCKET_FOLLOW: string = 'follow';
  private readonly WEBSOCKET_NOTIFICATION: string = 'notification';

  constructor(
    private http: HttpClient,
    private socket: Socket,
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

  /**
   * unfollows selected user
   * @param unfollowUserId requested user id to unfollow
   */
  unFollowUser(unfollowUserId: string): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/users/unfollow-user`, {
      unfollowUserId
    });
  }

  /**
   * marks notification as read
   * @param notification notifiaction to be marked
   */
  markNotification(notification: NotificationsObj): Observable<User> {
    return this.http.post<User>(`${environment.BASEURL}/api/users/mark-notification`, {
      notification
    });
  }

  /**
   * deletes notification
   * @param notification notification to be deleted
   */
  deleteNotification(notification: NotificationsObj): Observable<User> {
    return this.http.post<User>(`${environment.BASEURL}/api/users/delete-notification`, {
      notification
    });
  }

  /**
   * marks all notifications as read
   */
  markAllNotifications(): Observable<User> {
    return this.http.post<User>(`${environment.BASEURL}/api/users/mark-all`, {});
  }

  ///////////////////////////////////////////
  /// *** WEBSOCKETS
  ///////////////////////////////////////////

  /**
   * emits on new follow
   */
  emitNewFollowSocket() {
    this.socket.emit(this.WEBSOCKET_FOLLOW);
  }

  /**
   * receives new follow
   */
  receiveNewFollowSocket(): Observable<{}> {
    return this.socket.fromEvent(this.WEBSOCKET_FOLLOW);
  }

  /**
   * emits on notification action
   */
  emitNewNotificationActionSocket() {
    this.socket.emit(this.WEBSOCKET_NOTIFICATION);
  }

  /**
   * receives new notification action
   */
  receiveNewNotificationActionSocket(): Observable<{}> {
    return this.socket.fromEvent(this.WEBSOCKET_NOTIFICATION);
  }
}
