import { User } from 'src/users/models/user.model';

export interface CustomRequest extends Request {
    headers: CustomHeaders;
    user?: User;
}

export interface CustomHeaders extends Headers {
    auth?: string;
}
