import { User } from './user.interface';

export interface UserFollowing {
  _id?: string;
  userFollower: Following;
}

export interface Following extends User {
  _id: string;
}
