import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../interfaces/message.interface';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly WEBSOCKET_CHAT: string = 'chat';

  constructor(
    private socket: Socket,
    private http: HttpClient,
  ) { }

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

  ///////////////////////////////////////////
  /// *** WEBSOCKETS
  ///////////////////////////////////////////

  /**
   * emits on new chat
   */
  emitNewChatSocket() {
    this.socket.emit(this.WEBSOCKET_CHAT);
  }

  /**
   * receives new chat
   */
  receiveNewChatSocket(): Observable<{}> {
    return this.socket.fromEvent(this.WEBSOCKET_CHAT);
  }

}
