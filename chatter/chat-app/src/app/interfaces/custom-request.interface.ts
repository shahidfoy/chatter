import { User } from '../streams/interfaces/user.interface';

export interface CustomRequest extends Request {
    headers: CustomHeaders;
    user?: User | string | {};
}

export interface CustomHeaders extends Headers {
    auth?: string;
}
