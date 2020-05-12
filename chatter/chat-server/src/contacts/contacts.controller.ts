import { Controller, Post, Req, Body, Get, Param } from '@nestjs/common';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { ContactsService } from './contacts.service';
import { Following } from './models/following.model';
import { Follower } from './models/follower.model';

@Controller('contacts')
export class ContactsController {

    constructor(private contactsService: ContactsService) {}

    /**
     * get user followers
     * @param userId user id
     * @param page current page number
     */
    @Get('followers/:userId/:page')
    async getUserFollowers(
        @Param('userId') userId: string,
        @Param('page') page: number = 0,
    ): Promise<Follower[]> {
        return this.contactsService.getUserFollowers(userId, page);
    }

    /**
     * get user following
     * @param userId user id
     * @param page current page number
     */
    @Get('following/:userId/:page')
    async getUserFollowing(
        @Param('userId') userId: string,
        @Param('page') page: number = 0,
    ): Promise<Following[]> {
        return this.contactsService.getUserFollowing(userId, page);
    }

    /**
     * gets user followers count
     * @param userId user id
     */
    @Get('total/followers/count/:userId')
    async getUserFollowersCount(
        @Param('userId') userId: string,
    ): Promise<number> {
        return this.contactsService.getUserFollowersCount(userId);
    }

    /**
     * gets user following count
     * @param userId user id
     */
    @Get('total/following/count/:userId')
    async getUserFollowingCount(
        @Param('userId') userId: string,
    ): Promise<number> {
        return this.contactsService.getUserFollowingCount(userId);
    }

    /**
     * checks to see if user is following requested user followed
     * @param userId user id
     * @param userFollowed user followed id
     */
    @Get('following/check/:userId/:userFollowed')
    async checkUserFollowing(
        @Param('userId') userId: string,
        @Param('userFollowed') userFollowed: string,
    ): Promise<boolean> {
        return this.contactsService.checkUserFollowing(userId, userFollowed);
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
        return await this.contactsService.followUser(req.user, requestToFollowUserId);
    }

    /**
     * lets logged in user unfollow another user
     * @param req custom request
     * @param requestToUnfollowUserId id of requested user to unfollow
     */
    @Post('unfollow-user')
    async unfollowUser(
        @Req() req: CustomRequest,
        @Body('unfollowUserId') requestToUnFollowUserId: string,
    ): Promise<string> {
        return await this.contactsService.unfollowUser(req.user, requestToUnFollowUserId);
    }
}
