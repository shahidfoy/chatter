import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../interfaces/message.interface';
import { Socket } from 'ngx-socket-io';
import { ChatParams } from '../interfaces/chat-params.interface';
import { Conversation } from '../interfaces/conversation.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly URL_API_CHAT: string = `${environment.BASEURL}/api/chat`;
  private readonly WEBSOCKET_JOIN_CHAT: string = 'join_chat';
  private readonly WEBSOCKET_CHAT: string = 'chat';
  private readonly WEBSOCKET_TYPING: string = 'typing';
  private readonly WEBSOCKET_STOP_TYPING: string = 'stop_typing';

  constructor(
    private socket: Socket,
    private http: HttpClient,
  ) { }

  /**
   * gets logged in users conversations list
   */
  getConversationsList(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.URL_API_CHAT}/conversations-list`);
  }

  /**
   * gets messages between two users
   * @param senderId senders id
   * @param receiverId receivers id
   */
  getMessages(senderId: string, receiverId: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.URL_API_CHAT}/message/${senderId}/${receiverId}`);
  }

  /**
   * marks receivers messages as read
   * @param sender logged in user
   * @param receiver receiver of logged in users messages
   */
  markReceiverMessages(sender: string, receiver: string): Observable<void> {
    return this.http.get<void>(`${this.URL_API_CHAT}/mark-receiver-messages/${sender}/${receiver}`);
  }

  /**
   * sends chat message
   * @param senderId senders id
   * @param receiverId receivers id
   * @param receiverName receivers username
   * @param message message being sent
   */
  sendMessage(senderId: string, receiverId: string, receiverName: string, message: string): Observable<Message> {
    return this.http.post<Message>(`${this.URL_API_CHAT}/message/${senderId}/${receiverId}`, {
      receiverName,
      message
    });
  }

  ///////////////////////////////////////////
  /// *** WEBSOCKETS
  ///////////////////////////////////////////

  /**
   * emits join chat event
   * @param chatParams chat params
   */
  emitJoinChatSocket(chatParams: any) {
    this.socket.emit(this.WEBSOCKET_JOIN_CHAT, chatParams);
  }

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

  /**
   * emits when user is typing
   * @param sender logged in user username
   * @param receiver receiver username
   */
  emitTypingSocket(sender: string, receiver: string) {
    this.socket.emit(this.WEBSOCKET_TYPING, { sender, receiver });
  }

  /**
   * receives typing event
   */
  receiveTypingSocket(): Observable<ChatParams> {
    return this.socket.fromEvent(this.WEBSOCKET_TYPING);
  }

  /**
   * emits when user stopped typing
   * @param sender logged in user username
   * @param receiver receiver username
   */
  emitStopTypingSocket(sender: string, receiver: string) {
    this.socket.emit(this.WEBSOCKET_STOP_TYPING, { sender, receiver });
  }

  /**
   * receives user stopped typing event
   */
  receiveStopTypingSocket(): Observable<ChatParams> {
    return this.socket.fromEvent(this.WEBSOCKET_STOP_TYPING);
  }
}
