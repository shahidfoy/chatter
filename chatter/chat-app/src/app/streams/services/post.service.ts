import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interfaces/post.interface';
import { Socket } from 'ngx-socket-io';

/**
 * Retrieves the REST endpoints for posts
 */
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
  getPosts(page: number = 0): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.BASEURL}/api/posts/all/${page}`);
  }

  /**
   * gets posts by user id
   * @param userId user id
   */
  getPostsByUserId(userId: string, page: number = 0): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.BASEURL}/api/posts/userId/${userId}/${page}`);
  }

  /**
   * gets trending posts
   */
  getTrendingPosts(page: number = 0): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.BASEURL}/api/posts/trending/${page}`);
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
   * edit post
   * @param body post to be edited
   */
  editPost(body: Post): Observable<Post> {
    return this.http.put<Post>(`${environment.BASEURL}/api/posts/edit-post`, body);
  }

  /**
   * delete post
   * @param postId post id
   */
  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${environment.BASEURL}/api/posts/delete-post/${postId}`);
  }

  /**
   * adds like to post
   * @param body post
   */
  addLike(post: Post): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/posts/like`, post);
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
  addComment(postId: string, receiverId: string, comment: string): Observable<any> {
    return this.http.post<any>(`${environment.BASEURL}/api/posts/add-comment`, {
      postId,
      receiverId,
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
