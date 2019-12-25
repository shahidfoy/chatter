import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interfaces/post.interface';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly WEBSOCKET_POST: string = 'post';
  private readonly WEBSOCKET_COMMENT: string = 'comment';

  constructor(
    private socket: Socket,
    private http: HttpClient,
  ) { }

  /**
   * gets all posts
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.BASEURL}/api/posts`);
  }

  /**
   * gets post by id
   * @param id post it
   */
  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.BASEURL}/api/posts/${id}`);
  }

  /**
   * adds post
   * @param body post
   */
  addPost(body: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.BASEURL}/api/posts/add-post`, body);
  }

  /**
   * adds like to post
   * @param body post
   */
  addLike(body: Post): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/posts/like`, body);
  }

  /**
   * adds dislike to post
   * @param body post
   */
  addDislike(body: Post): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/posts/dislike`, body);
  }

  /**
   * adds comment to post by post id
   * @param postId post id
   * @param comment comment for post
   */
  addComment(postId: string, comment: string): Observable<any> {
    return this.http.post<any>(`${environment.BASEURL}/api/posts/add-comment`, {
      postId,
      comment
    });
  }

  ///////////////////////////////////////////
  /// *** WEBSOCKETS
  ///////////////////////////////////////////

  /**
   * emits on new post
   */
  emitNewPostSocket() {
    this.socket.emit(this.WEBSOCKET_POST);
  }

  /**
   * receives new post
   */
  receiveNewPostSocket(): Observable<{}> {
    return this.socket.fromEvent(this.WEBSOCKET_POST);
  }

  /**
   * emits new comment
   */
  emitNewCommentSocket() {
    this.socket.emit(this.WEBSOCKET_COMMENT);
  }

  /**
   * receives new comment
   */
  receiveNewCommentSocket(): Observable<{}> {
    return this.socket.fromEvent(this.WEBSOCKET_COMMENT);
  }
}
