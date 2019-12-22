import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../interfaces/post.interface';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly WEBSOCKET_POST: string = 'post';

  constructor(
    private socket: Socket,
    private http: HttpClient,
  ) { }

  addPost(body: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.BASEURL}/api/posts/add-post`, body);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.BASEURL}/api/posts`);
  }

  addLike(body: Post): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/posts/like`, body);
  }

  addDislike(body: Post): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/posts/dislike`, body);
  }

  ///////////////////////////////////////////
  /// *** WEBSOCKETS
  ///////////////////////////////////////////

  emitNewPostSocket() {
    this.socket.emit(this.WEBSOCKET_POST);
  }

  receiveNewPostSocket(): Observable<{}> {
    return this.socket.fromEvent(this.WEBSOCKET_POST);
  }
}
