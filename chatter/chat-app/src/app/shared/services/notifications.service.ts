import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

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
    return this.http.delete<string>(`${environment.BASEURL}/api/delete/${notificationId}`);
  }
}
