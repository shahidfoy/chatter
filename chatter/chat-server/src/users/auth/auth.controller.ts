import { Controller, Post, Body, InternalServerErrorException, Req, Get } from '@nestjs/common';
import { Token } from '../../interfaces/response-token.interface';
import { AuthService } from './auth.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    /**
     * creates new user
     * @param username users username
     * @param email users email
     * @param password users password
     */
    @Post('/register')
    async createUser(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ): Promise<Token> {
        return await this.authService.createUser(username, email, password);
    }

    /**
     * logs in registered users
     * @param email users email
     * @param password users password
     */
    @Post('/login')
    async loginUser(
        @Body('email') email: string,
        @Body('password') password: string,
    ): Promise<Token> {
        if (!email || !password) {
            throw new InternalServerErrorException({ message: 'No empty fields allowed' });
        }
        return await this.authService.loginUser(email, password);
    }

    /**
     * sets user status as OFFLINE
     * @param id user id
     */
    @Post('/logout')
    async logoutUser(
        @Body('id') id: string,
    ) {
        this.authService.logoutUser(id);
    }
}
