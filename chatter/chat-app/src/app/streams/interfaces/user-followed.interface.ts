import { User } from '../../interfaces/user.interface';

export interface UserFollowed {
  _id?: string;
  userFollowed: Followed;
}

export interface Followed extends User {
  _id: string;
}
