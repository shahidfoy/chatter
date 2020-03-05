import * as mongoose from 'mongoose';

export const ChatListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatList' },
    receiverId: { type: String },
    messageId: { type: String },
});

export interface ChatList {
    _id: string;
    receiverId: string;
    messageId: string;
}
