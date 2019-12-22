import { Controller, Post, Get, Body, InternalServerErrorException } from '@nestjs/common';
import { UsersService, Token } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/register')
    async createUser(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ): Promise<Token> {
        return await this.usersService.createUser(username, email, password);
    }

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

    @Get()
    getUsers() {
        return 'getting users';
    }
}
