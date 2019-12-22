import { User } from './user.interface';

export interface Post {
  _id: string;
  user: User;
  username: string;
  post: string;
  tags: string[];
  comments: UserComment[];
  totalLikes: number;
  likes: UsernameObj[];
  totalDislikes: number;
  dislikes: UsernameObj[];
  createdAt: Date;
}

export interface UserComment {
  userId: User;
  username: string;
  comment: string;
  createdAt: Date;
}

export interface UsernameObj {
  username: string;
}
