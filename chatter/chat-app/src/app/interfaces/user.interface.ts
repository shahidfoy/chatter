import { UsernameObj } from './username-obj.interface';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  posts: UserPost[];
  following: UsernameObj[];
  followers: UsernameObj[];
}

export interface UserPost {
  _id: string;
  postId: string;
  post: string;
  createdAt: Date;
}
