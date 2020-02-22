import * as mongoose from 'mongoose';

export const FollowingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFollowed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export interface Following extends mongoose.Document {
    _id: string;
    userId: string;
    userFollowed: string;
}
