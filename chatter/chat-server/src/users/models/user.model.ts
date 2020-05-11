import * as mongoose from 'mongoose';

export const UserSchema =  new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    onlineStatus: { type: String },
    picVersion: { type: String, default: '' },
    picId: { type: String, default: '' },
});

export interface User extends mongoose.Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    onlineStatus: string;
    picVersion: string;
    picId: string;
}
