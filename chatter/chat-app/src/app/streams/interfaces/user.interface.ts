import { UsernameObj } from './username-obj.interface';
import { UserFollowed } from './user-followed.interface';
import { UserFollowing } from './user-following.interface';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  posts: UserPost[];
  following: UserFollowed[];
  followers: UserFollowing[];
}

export interface UserPost {
  _id: string;
  postId: string;
  post: string;
  createdAt: Date;
}
