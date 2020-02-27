import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly WEBSOCKET_NOTIFICATION: string = 'notification';

  constructor(
    private http: HttpClient,
    private socket: Socket,
  ) { }

  /**
   * gets user notifications
   * @param userId user id
   */
  getNotificaitons(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.BASEURL}/api/notifications/${userId}`);
  }

  /**
   * gets user notification count
   * @param userId user id
   */
  getNotificationsCount(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.BASEURL}/api/notifications/count/${userId}`);
  }

  /**
   * deletes notification by id
   * @param notificationId notification id
   */
  deleteNotification(notificationId: string): Observable<string> {
    return this.http.delete<string>(`${environment.BASEURL}/api/notifications/delete/${notificationId}`);
  }

  /**
   * deletes all notifications by user id
   * @param userId user id
   */
  deleteAllNotifications(userId: string): Observable<string> {
    return this.http.delete<string>(`${environment.BASEURL}/api/notifications/delete-all/${userId}`);
  }

  ///////////////////////////////////////////
  /// *** WEBSOCKETS
  ///////////////////////////////////////////

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
