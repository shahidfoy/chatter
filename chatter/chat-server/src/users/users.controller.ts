import { Controller, Post, Get, Body, InternalServerErrorException } from '@nestjs/common';
import { UsersService, Token } from './users.service';
import { User } from './models/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

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
        return await this.usersService.createUser(username, email, password);
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
        return await this.usersService.loginUser(email, password);
    }

    /**
     * gets all users
     * TODO:: IMPLEMENT PAGAINATION
     */
    @Get()
    async getUsers(): Promise<User[]> {
        return await this.usersService.getUsers();
    }
}
