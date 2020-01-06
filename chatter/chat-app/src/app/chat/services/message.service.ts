import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  /**
   * gets messages between two users
   * @param senderId senders id
   * @param receiverId receivers id
   */
  getMessages(senderId: string, receiverId: string): Observable<Message> {
    return this.http.get<Message>(`${environment.BASEURL}/api/chat/message/${senderId}/${receiverId}`);
  }

  /**
   * sends chat message
   * @param senderId senders id
   * @param receiverId receivers id
   * @param receiverName receivers username
   * @param message message being sent
   */
  sendMessage(senderId: string, receiverId: string, receiverName: string, message: string): Observable<Message> {
    return this.http.post<Message>(`${environment.BASEURL}/api/chat/message/${senderId}/${receiverId}`, {
      receiverName,
      message
    });
  }
}
