import { User } from '../../shared/interfaces/user.interface';

export interface UserFollowing {
  _id?: string;
  userId: string;
  userFollowed: User;
}
