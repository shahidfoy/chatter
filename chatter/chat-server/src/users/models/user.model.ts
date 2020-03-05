import * as mongoose from 'mongoose';

export const UserSchema =  new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    onlineStatus: { type: String },
    chatList: [
        {
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
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
    chatList: ChatList[];
    picVersion: string;
    picId: string;
}
export interface ChatList {
    _id: string;
    receiverId: string;
    messageId: string;
}
