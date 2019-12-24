import { Controller, Get, Post, Req, Body } from '@nestjs/common';
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

    @Post('follow-user')
    async followUser(
        @Req() req: CustomRequest,
        @Body('followUserId') requestToFollowUserId: string,
    ): Promise<string> {
        return await this.usersService.followUser(req.user, requestToFollowUserId);
    }
}
