import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, NotificationsObj } from './models/user.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    /**
     * gets all users
     * TODO:: IMPLEMENT PAGAINATION
     */
    async getUsers(): Promise<User[]> {
        return await this.userModel.find()
                                    .populate('posts.postId')
                                    .then((users: User[]) => {
                                        return users;
                                    })
                                    .catch(() => {
                                        throw new InternalServerErrorException({ message: 'Error Occured unable to get all users' });
                                    });
    }

    /**
     * get user by id
     * @param userId user's id
     */
    async getUserById(userId: string): Promise<User> {
        return await this.userModel.findOne({ _id: userId })
                                    .populate('posts.postId')
                                    .populate('following.userFollowed')
                                    .populate('followers.userFollower')
                                    .populate('chatList.receiverId')
                                    .populate('chatList.messageId')
                                    .populate('notifications.senderId')
                                    .then((user: User) => {
                                        return user;
                                    })
                                    .catch((err) => {
                                        throw new InternalServerErrorException({ message: `Error getting user by id ${err}` });
                                    });
    }

    /**
     * get user by username
     * @param userId user's username
     */
    async getUserByUsername(username: string): Promise<User> {
        return await this.userModel.findOne({ username })
                                    .populate('posts.postId')
                                    .populate('following.userFollowed')
                                    .populate('followers.userFollower')
                                    .populate('chatList.receiverId')
                                    .populate('chatList.messageId')
                                    .populate('notifications.senderId')
                                    .then((user: User) => {
                                        return user;
                                    })
                                    .catch((err) => {
                                        throw new InternalServerErrorException({ message: `Error getting user by username ${err}` });
                                    });
    }

    /**
     * follows another user and updates both user's arrays for following and followers
     * @param user logged in user
     * @param requestToFollowUserId follow request for another user
     */
    async followUser(user: User, requestToFollowUserId: string): Promise<string> {
        const followUser = async () => {
            await this.userModel.updateOne({
                '_id': user._id,
                'following.userFollowed': { $ne: requestToFollowUserId },
            }, {
                $push: {
                    following: {
                        userFollowed: requestToFollowUserId,
                    },
                },
            });

            await this.userModel.updateOne({
                '_id': requestToFollowUserId,
                'followers.userFollower': { $ne: user._id },
            }, {
                $push: {
                    followers: {
                        userFollower: user._id,
                    },
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
            await this.userModel.updateOne({
                '_id': user._id,
                'following.userFollowed': { $eq: requestToUnfollowUserId },
            }, {
                $pull: {
                    following: {
                        userFollowed: requestToUnfollowUserId,
                    },
                },
            });

            await this.userModel.updateOne({
                '_id': requestToUnfollowUserId,
                'followers.userFollower': { $eq: user._id },
            }, {
                $pull: {
                    followers: {
                        userFollower: user._id,
                    },
                },
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
     * marks notification as read
     * @param user logged in user
     * @param notification notification to be marked as read
     */
    async markNotification(user: User, notification: NotificationsObj): Promise<User> {
        return await this.userModel.updateOne({
            '_id': user._id,
            'notifications._id': notification._id,
        }, {
            $set: { 'notifications.$.read': true },
        }).then(() => {
            return user;
        }).catch((err) => {
            throw new InternalServerErrorException({ message: `Marking Notification Error Occured ${err}` });
        });
    }

    /**
     * removes notification from users notification array
     * @param user logged in user
     * @param notification notification to be removed
     */
    async deleteNotification(user: User, notification: NotificationsObj): Promise<User> {
        return await this.userModel.updateOne({
            '_id': user._id,
            'notifications._id': notification._id,
        }, {
            $pull: {
                notifications: { _id: notification._id },
            },
        }).then(() => {
            return user;
        }).catch((err) => {
            throw new InternalServerErrorException({ message: `Deleting Notification Error Occured ${err}` });
        });
    }

    /**
     * marks all of logged in users notifications as read
     */
    async markAll(user: User): Promise<User> {
        return await this.userModel.updateOne({
            _id: user._id,
        }, {
            $set: { 'notifications.$[elem].read': true },
        }, {
            arrayFilters: [{ 'elem.read': false }],
            multi: true,
        }).then(() => {
            return user;
        }).catch((err) => {
            throw new InternalServerErrorException({ message: `Marking All Error Occured ${err}` });
        });
    }
}
