import * as mongoose from 'mongoose';

export const FollowersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFollower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
