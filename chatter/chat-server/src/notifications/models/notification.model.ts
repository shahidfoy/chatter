import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderUsername: { type: String },
    message: { type: String },
    viewProfile: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    read: { type: Boolean, default: false },
    date: { type: String, default: '' },
});

export interface Notification extends mongoose.Document {
    _id: string;
    userId: string;
    senderId: string;
    senderUsername: string;
    message: string;
    viewProfile: boolean;
    createdAt: Date;
    read: boolean;
    date: string;
}
