import { Controller, Get, Post, Req, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    /**
     * gets all users
     * @param page current page number
     */
    @Get(':page')
    async getUsers(
        @Param('page') page: number = 0,
    ): Promise<User[]> {
        return await this.usersService.getUsers(page);
    }

    /**
     * get user by id
     * @param userId user's id
     */
    @Get('id/:userId')
    async getUserById(
        @Param('userId') userId: string,
    ): Promise<User> {
        return await this.usersService.getUserById(userId);
    }

    /**
     * get user by username
     * @param username user's username
     */
    @Get('username/:username')
    async getUserByUsername(
        @Param('username') username: string,
    ): Promise<User> {
        return await this.usersService.getUserByUsername(username);
    }
}
