import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follower } from './models/follower.model';
import { Following } from './models/following.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class ContactsService {

    constructor(
        @InjectModel('Follower') private readonly followerModel: Model<Follower>,
        @InjectModel('Following') private readonly followingModel: Model<Following>,
    ) {}

    /**
     * gets a list of users that follow the selected user id
     * TODO:: ADD PAGINATION
     * @param userId user id
     */
    async getUserFollowers(userId: string): Promise<Follower[]> {
        return await this.followerModel
                            .find({userId})
                            .populate('userFollower')
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user followers ${err}` });
                            });
    }

    /**
     * gets a list of users that the selected user id is following
     * TODO:: ADD PAGINATION
     * @param userId user id
     */
    async getUserFollowing(userId: string): Promise<Following[]> {
        return await this.followingModel
                            .find({userId})
                            .populate('userFollowed')
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user following ${err}` });
                            });
    }

    /**
     * gets count of users that follow the selected user id
     * @param userId user id
     */
    async getUserFollowersCount(userId: string): Promise<number> {
        return await this.followerModel
                            .count({userId})
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user followers count ${err}` });
                            });
    }

    /**
     * gets count of users that the selected user id is following
     * @param userId user id
     */
    async getUserFollowingCount(userId: string): Promise<number> {
        return await this.followingModel
                            .count({userId})
                            .catch((err) => {
                                throw new InternalServerErrorException({ message: `Unable to get user following count ${err}` });
                            });
    }

    /**
     * follows another user and updates both user's arrays for following and followers
     * @param user logged in user
     * @param requestToFollowUserId follow request for another user
     */
    async followUser(user: User, requestToFollowUserId: string): Promise<string> {
        const alreadyFollowing = await this.followingModel.findOne({
                                            userId: user._id,
                                            userFollowed: requestToFollowUserId,
                                        });

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
            }, {
                $push: {
                    // refactor notifications into notifications service
                    notifications: {
                        senderId: user._id,
                        senderUsername: user.username,
                        message: `${user.username} is now following you.`,
                        createdAt: new Date(),
                    },
                },
            });
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
            const alreadyFollowing = await this.followingModel.findOne({
                userId: user._id,
                userFollowed: requestToUnfollowUserId,
            });

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
}
