import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';

@Injectable()
export class UsersService {

    private readonly LIMIT = 9;

    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    /**
     * gets all users
     * @param page current page number
     */
    async getUsers(page: number = 0): Promise<User[]> {
        const skip = page * this.LIMIT;
        return await this.userModel.find({}, {},
                                    { skip, limit: this.LIMIT })
                                    .sort({ username: 1 })
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
                                    .then((user: User) => {
                                        return user;
                                    })
                                    .catch((err) => {
                                        throw new InternalServerErrorException({ message: `Error getting user by username ${err}` });
                                    });
    }
}
