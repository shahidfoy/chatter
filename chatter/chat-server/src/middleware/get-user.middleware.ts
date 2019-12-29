import { Injectable, NestMiddleware, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { dbConfig } from '../config/db.config';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { UserJwtToken } from '../interfaces/jwt-token.interface';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    use(req: CustomRequest, res: Response, next: () => void) {
        const jwtToken = req.headers.auth;

        if (!jwtToken) {
            next();
            return;
        }

        try {
            const user: UserJwtToken = jwt.verify(jwtToken, dbConfig.secret) as UserJwtToken;

            if (user) {
                // console.log('Found user; details in jwt: ' , user);
                req.user = user.data;
            }
        } catch (err) {
            // console.log('Error handling authentication JWT: ', err);
            throw new InternalServerErrorException({ message: 'Token has expired. Please login again.', jwtToken: null });
        }
        next();
    }
}
