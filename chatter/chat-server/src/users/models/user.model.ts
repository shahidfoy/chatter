import * as mongoose from 'mongoose';

export const UserSchema =  new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    onlineStatus: { type: String },
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
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
        },
    ],
    picVersion: { type: String, default: '' },
    picId: { type: String, default: '' },
});

export interface User extends mongoose.Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    onlineStatus: string;
    notifications: NotificationsObj[];
    chatList: ChatList[];
    picVersion: string;
    picId: string;
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

export interface ChatList {
    _id: string;
    receiverId: string;
    messageId: string;
}
