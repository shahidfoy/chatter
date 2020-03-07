import { User } from '../../shared/interfaces/user.interface';

export interface UserFollower {
  _id?: string;
  userId: string;
  userFollower: User;
}
