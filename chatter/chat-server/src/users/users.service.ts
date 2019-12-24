import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';

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
}
