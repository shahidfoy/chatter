import { UserFollowed } from '../streams/interfaces/user-followed.interface';
import { UserFollowing } from '../streams/interfaces/user-following.interface';
import { Post } from '../streams/interfaces/post.interface';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  posts: UserPost[];
  following: UserFollowed[];
  followers: UserFollowing[];
  notifications: NotificationsObj[];
}

export interface UserPost {
  _id: string;
  postId: string | Post;
  post: string;
  createdAt: Date;
}

export interface NotificationsObj {
  _id: string;
  senderId: string;
  senderUsername: string;
  message: string;
  viewProfile: boolean;
  createdAt: Date;
  read: boolean;
  date: string;
}
