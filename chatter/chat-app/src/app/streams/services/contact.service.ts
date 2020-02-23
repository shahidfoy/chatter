import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserFollower } from '../interfaces/user-follower.interface';
import { UserFollowing } from '../interfaces/user-following.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  /**
   * get user followers
   * TODO:: ADD PAGINATION
   * @param userId user id
   */
  getUserFollowers(userId: string): Observable<UserFollower[]> {
    return this.http.get<UserFollower[]>(`${environment.BASEURL}/api/contacts/followers/${userId}`);
  }

  /**
   * get user following
   * TODO:: ADD PAGINATION
   * @param userId user id
   */
  getUserFollowing(userId: string): Observable<UserFollowing[]> {
    return this.http.get<UserFollowing[]>(`${environment.BASEURL}/api/contacts/following/${userId}`);
  }

  /**
   * gets user followers count
   * @param userId user id
   */
  getUserFollowersCount(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.BASEURL}/api/contacts/followers/count/${userId}`);
  }

  /**
   * gets user following count
   * @param userId user id
   */
  getUserFollowingCount(userId: string): Observable<number> {
    return this.http.get<number>(`${environment.BASEURL}/api/contacts/following/count/${userId}`);
  }

  checkUserFollowing(userId: string, userFollowingId: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.BASEURL}/api/contacts/following/check/${userId}/${userFollowingId}`);
  }

  /**
   * follows selected user
   * @param followUserId requested user id to follow
   */
  followUser(followUserId: string): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/contacts/follow-user`, {
      followUserId
    });
  }

  /**
   * unfollows selected user
   * @param unfollowUserId requested user id to unfollow
   */
  unFollowUser(unfollowUserId: string): Observable<string> {
    return this.http.post<string>(`${environment.BASEURL}/api/contacts/unfollow-user`, {
      unfollowUserId
    });
  }
}
