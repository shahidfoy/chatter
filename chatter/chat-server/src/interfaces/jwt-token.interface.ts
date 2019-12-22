import { User } from 'src/users/models/user.model';

export interface UserJwtToken {
    data: User;
    iat: number;
    exp: number;
}
