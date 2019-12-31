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

  sendMessage(senderId: string, receiverId: string, receiverName: string, message: string): Observable<Message> {
    return this.http.post<Message>(`${environment.BASEURL}/api/chat/message/${senderId}/${receiverId}`, {
      receiverName,
      message
    });
  }
}
