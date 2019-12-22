import { User } from './user.interface';

export interface CustomRequest extends Request {
    headers: CustomHeaders;
    user?: User | string | {};
}

export interface CustomHeaders extends Headers {
    auth?: string;
}
