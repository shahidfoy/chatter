import * as mongoose from 'mongoose';

// export const ConversationSchema = new mongoose.Schema({
//     participants: [
//         {
//             senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//             receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         },
//     ],
// });

// export interface Conversation extends mongoose.Document {
//     _id: string;
//     participants: Participants[];
// }

// export interface Participants {
//     _id?: string;
//     senderId: string;
//     receiverId: string;
// }

export const ConversationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    createdAt: { type: Date, default: Date.now() },
});

export interface Conversation extends mongoose.Document {
    _id: string;
    senderId: string;
    receiverId: string;
    messageId: string;
    createdAt: Date;
}
