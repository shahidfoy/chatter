import * as mongoose from 'mongoose';
import { User } from 'src/users/models/user.model';

export const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types. ObjectId, ref: 'User' },
    username: { type: String, default: '' },
    post: { type: String, default: '' },
    tags: [{ type: String, default: [] }],
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, default: '' },
            comment: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now() },
        },
    ],
    totalLikes: { type: Number, default: 0 },
    likes: [
        { username: { type: String, default: '' } },
    ],
    totalDislikes: { type: Number, default: 0 },
    dislikes: [
        { username: { type: String, default: '' } },
    ],
    createdAt: { type: Date, default: Date.now() },
});

export interface UserPost extends mongoose.Document {
    _id: string;
    user: User;
    username: string;
    post: string;
    tags: string[];
    comments: UserComment[];
    totalLikes: number;
    likes: UsernameObj[];
    totalDislikes: number;
    dislikes: UsernameObj[];
    createdAt: Date;
}

export interface UserComment {
    userId: User;
    username: string;
    comment: string;
    createdAt: Date;
}

export interface UsernameObj {
    username: string;
}
