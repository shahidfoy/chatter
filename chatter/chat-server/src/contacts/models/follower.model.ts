import * as mongoose from 'mongoose';
import { User } from 'src/users/models/user.model';

export const FollowerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFollower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export interface Follower extends mongoose.Document {
    _id: string;
    userId: string;
    userFollower: User;
}
