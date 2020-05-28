import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follower } from './models/follower.model';
import { Following } from './models/following.model';
import { User } from '../users/models/user.model';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContactsService {

    private readonly LIMIT = 9;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Follower') private readonly followerModel: Model<Follower>,
        @InjectModel('Following') private readonly followingModel: Model<Following>,
        private notificationsService: NotificationsService,
    ) {}

    /**
     * gets a list of users that follow the selected user id
     * @param userId user id
     * @param page current page number
     */
    async getUserFollowers(userId: string, page: number = 0): Promise<Follower[]> {
        const skip = page * this.LIMIT;
        return await this.followerModel
                            .find({userId}, {},
                            { skip, limit: this.LIMIT })
                            .populate({ path: 'userFollower' })
                            .then(result => {
                                return result.sort((user1, user2) => (user1.userFollower.username > user2.userFollower.username ? 1 : -1));
                            })
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user followers ${err}` });
                            });
    }

    /**
     * gets a list of users that the selected user id is following
     * @param userId user id
     * @param page current page number
     */
    async getUserFollowing(userId: string, page: number = 0): Promise<Following[]> {
        const skip = page * this.LIMIT;
        return await this.followingModel
                            .find({userId}, {},
                            { skip, limit: this.LIMIT })
                            .populate({ path: 'userFollowed'})
                            .then(result => {
                                return result.sort((user1, user2) => (user1.userFollowed.username > user2.userFollowed.username ? 1 : -1));
                            })
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user following ${err}` });
                            });
    }

    /**
     * gets count of users that follow the selected user id
     * @param userId user id
     */
    async getUserFollowersCount(userId: string): Promise<number> {
        if (!userId) { throw new InternalServerErrorException({ message: `Missing user credentails`}); }
        return await this.followerModel
                            .countDocuments({userId})
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user followers count ${err}` });
                            });
    }

    /**
     * gets count of users that the selected user id is following
     * @param userId user id
     */
    async getUserFollowingCount(userId: string): Promise<number> {
        if (!userId) { throw new InternalServerErrorException({ message: `Missing user credentials`}); }
        return await this.followingModel
                            .countDocuments({userId})
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user following count ${err}` });
                            });
    }

    /**
     * checks to see if user is following requested user followed
     * @param userId user id
     * @param userFollowed user followed id
     */
    async checkUserFollowing(userId: string, userFollowed: string): Promise<boolean> {
        const following = await this.findOneFollowing(userId, userFollowed);
        return following ? true : false;
    }

    /**
     * follows another user and updates both user's arrays for following and followers
     * @param user logged in user
     * @param requestToFollowUserId follow request for another user
     */
    async followUser(user: User, requestToFollowUserId: string): Promise<string> {
        const alreadyFollowing = await this.findOneFollowing(user._id, requestToFollowUserId);
        if (alreadyFollowing) {
            throw new BadRequestException({ message: `Already following user` });
        }

        const followUser = async () => {
            await this.followingModel.create({
                userId: user._id,
                userFollowed: requestToFollowUserId,
            });

            await this.followerModel.create({
                userId: requestToFollowUserId,
                userFollower: user._id ,
            });

            await this.notificationsService.createFollowNotification(user, requestToFollowUserId);
        };

        return followUser()
            .then(() => {
                return JSON.stringify(requestToFollowUserId);
            })
            .catch((err) => {
                throw new InternalServerErrorException({ message: `Following user Error Occured ${err}` });
            });
    }

    /**
     * unfollows another user and updates both user's arrays for following and followers
     * @param user logged in user
     * @param requestToUnfollowUserId unfollow request for another user
     */
    async unfollowUser(user: User, requestToUnfollowUserId: string): Promise<string> {
        const unfollowUser = async () => {
            const alreadyFollowing = await this.findOneFollowing(user._id, requestToUnfollowUserId);
            if (!alreadyFollowing) {
                throw new BadRequestException({ message: `not following user` });
            }

            await this.followingModel.deleteOne({
                userId: user._id,
                userFollowed: requestToUnfollowUserId,
            });

            await this.followerModel.deleteOne({
                userId: requestToUnfollowUserId,
                userFollower: user._id,
            });
        };

        return unfollowUser()
            .then(() => {
                return JSON.stringify(requestToUnfollowUserId);
            })
            .catch((err) => {
                throw new InternalServerErrorException({ message: `Following user Error Occured ${err}` });
            });
    }

    /**
     * finds if user id and user followed id exists
     * @param userId user id
     * @param userFollowed user being followed
     */
    private async findOneFollowing(userId: string, userFollowed: string): Promise<Following> {
        return await this.followingModel.findOne({ userId, userFollowed });
    }
}
