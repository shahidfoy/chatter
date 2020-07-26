import * as mongoose from 'mongoose';

export const TagSchema = new mongoose.Schema({
    tag: { type: String, default: '' },
    img: { type: String, default: '' },
    description: { type: String, default: '' },
});

export interface Tag extends mongoose.Document {
    _id: string;
    tag: string;
    img: string;
    description: string;
}
