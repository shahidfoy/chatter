import { Controller, Get, Post, Req, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { Token } from 'src/interfaces/response-token.interface';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    /**
     * gets all users
     * TODO:: IMPLEMENT PAGAINATION
     */
    @Get()
    async getUsers(): Promise<User[]> {
        return await this.usersService.getUsers();
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

    /**
     * lets logged in user follow another user
     * @param req custom request
     * @param requestToFollowUserId id of requested user to follow
     */
    @Post('follow-user')
    async followUser(
        @Req() req: CustomRequest,
        @Body('followUserId') requestToFollowUserId: string,
    ): Promise<string> {
        return await this.usersService.followUser(req.user, requestToFollowUserId);
    }
}
