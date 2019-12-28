import * as mongoose from 'mongoose';
import { UsernameObj } from 'src/interfaces/username-obj.interface';

export const UserSchema =  new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    posts: [
        {
            postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
            post: { type: String },
            createdAt: { type: Date, default: Date.now() },
        },
    ],
    following: [
        { userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} },
    ],
    followers: [
        { userFollower: { type: mongoose.Schema.Types.ObjectId, ref: 'User'} },
    ],
    notifications: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            senderUsername: { type: String },
            message: { type: String },
            viewProfile: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now() },
            read: { type: Boolean, default: false },
            date: { type: String, default: '' },
        },
    ],
});

export interface User extends mongoose.Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    posts: UserPost[]; // may replace with interface later
    following: UsernameObj[];
    followers: UsernameObj[];
    notifications: NotificationsObj[];
}

export interface UserPost {
    postId: string;
    post: string;
    createdAt: Date;
}

export interface NotificationsObj {
    _id: string;
    senderId: string;
    senderUsername: string;
    message: string;
    viewProfile: boolean;
    createdAt: Date;
    read: boolean;
    date: string;
}
