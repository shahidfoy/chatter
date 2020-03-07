import { Controller, Get, Post, Req, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

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

    // /**
    //  * marks notification as read
    //  * TODO:: refactor into notifications module
    //  * @param req custom request
    //  * @param notification notification to be marked
    //  */
    // @Post('mark-notification')
    // async markNotification(
    //     @Req() req: CustomRequest,
    //     @Body('notification') notification: Notification,
    // ): Promise<User> {
    //     return await this.usersService.markNotification(req.user, notification);
    // }

    // /**
    //  * removes notification from users notification array
    //  * TODO:: refactor into notifications module
    //  * @param req custom request
    //  * @param notification notification to be deleted
    //  */
    // @Post('delete-notification')
    // async deleteNotification(
    //     @Req() req: CustomRequest,
    //     @Body('notification') notification: Notification,
    // ): Promise<User> {
    //     return await this.usersService.deleteNotification(req.user, notification);
    // }

    // /**
    //  * marks all notifications as read
    //  * TODO:: refactor into notifications module
    //  */
    // @Post('mark-all')
    // async markAll(
    //     @Req() req: CustomRequest,
    // ): Promise<User> {
    //     return await this.usersService.markAll(req.user);
    // }
}
