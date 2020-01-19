import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: String },
    receiver: { type: String },
    message: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            sendername: { type: String },
            receivername: { type: String },
            body: { type: String, default: '' },
            isRead: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now() },
        },
    ],
});

export interface Message extends mongoose.Document {
    _id: string;
    conversationId: string;
    sender: string;
    receiver: string;
    message: MessageContents[];
}

export interface MessageContents {
    _id?: string;
    senderId: string;
    receiverId: string;
    sendername: string;
    receivername: string;
    body: string;
    isRead: boolean;
    createdAt: Date;
}
