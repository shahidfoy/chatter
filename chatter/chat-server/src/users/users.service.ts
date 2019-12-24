import { Injectable, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import { Token } from 'src/interfaces/response-token.interface';

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
}
