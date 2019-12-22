import { User } from './user.interface';

export interface JwtPayload {
  data: PayloadData;
}

export interface PayloadData extends User {
  _id: string;
  exp: number;
  iat: number;
}
