import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageContents } from './models/message.model';
import { Conversation } from './models/conversation.model';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Message') private readonly messageModel: Model<Message>,
        @InjectModel('Conversation') private readonly conversationModel: Model<Conversation>,
    ) {}

    /**
     * gets messages between two users
     * @param senderId senders id
     * @param receiverId receivers id
     */
    async getMessages(senderId: string, receiverId: string): Promise<Message> {
        const conversation = await this.conversationModel.findOne({
            $or: [
                {
                    $and: [
                        { 'participants.senderId': senderId },
                        { 'participants.receiverId': receiverId },
                    ],
                },
                {
                    $and: [
                        { 'participants.senderId': receiverId },
                        { 'participants.receiverId': senderId },
                    ],
                },
            ],
        }).select('_id');

        if (conversation) {
            const messages = await this.messageModel.findOne({ conversationId: conversation._id });
            return messages;
        }
        // might create new conversation if none located
        return null;
    }

    /**
     * check if chat conversation exists gets conversation or creates a new one
     * creates and sends a message and updates both users chatList
     * @param user logged in user
     * @param senderId sender id
     * @param receiverId receiver id
     * @param receiverName receiver name
     * @param message chat message
     */
    async sendMessage(user: User, senderId: string, receiverId: string, receiverName: string, message: string): Promise<Message> {
        const conversations = await this.conversationModel.find({
            $or: [
                { participants: { $elemMatch: { senderId, receiverId } } },
                { participants: { $elemMatch: { senderId: receiverId, receiverId: senderId } } },
            ],
        });

        if (conversations.length > 0) {
            return await this.messageModel.updateOne({
                conversationId: conversations[0]._id,
            }, {
                $push: {
                    message: {
                        senderId,
                        receiverId,
                        sendername: user.username,
                        receivername: receiverName,
                        body: message,
                        isRead: false,
                        createdAt: new Date(),
                    },
                },
            }).then(async () => {
                return await this.messageModel.findOne({ conversationId: conversations[0]._id });
            }).catch(error => {
                throw new InternalServerErrorException({ message: `Error message occured ${error}`});
            });
        } else {
            const body: Partial<Conversation> = {
                participants: [],
            };
            body.participants.push({ senderId, receiverId });
            const newConversation = await this.conversationModel.create(body);

            const messageBody: Partial<Message> = {
                conversationId: newConversation._id,
                sender: user.username,
                receiver: receiverName,
                message: [],
            };
            const messageContents: MessageContents = {
                senderId,
                receiverId,
                sendername: user.username,
                receivername: receiverName,
                body: message,
                isRead: false,
                createdAt: new Date(),
            };
            messageBody.message.push(messageContents);
            return await this.messageModel.create(messageBody)
                            .then(async (messageRes: Message) => {
                                await this.userModel.updateOne({ _id: user._id }, {
                                    $push: {
                                        chatList: {
                                            $each: [{
                                                receiverId,
                                                messageId: messageRes._id,
                                            }],
                                            $position: 0,
                                        },
                                    },
                                });

                                await this.userModel.updateOne({ _id: receiverId }, {
                                    $push: {
                                        chatList: {
                                            $each: [{
                                                receiverId: user._id,
                                                messageId: messageRes._id,
                                            }],
                                            $position: 0,
                                        },
                                    },
                                });
                                return messageRes;
                            }).catch(error => {
                                throw new InternalServerErrorException({ message: `Error message occured ${error}`});
                            });
        }
    }

    // private updateUserMessages(conversationId: string) {
    //     const messageBody: Partial<Message> = {
    //         conversationId: newConversation._id,
    //         sender: user.username,
    //         receiver: receiverName,
    //         message: [],
    //     };
    //     const messageContents: MessageContents = {
    //         senderId,
    //         receiverId,
    //         sendername: user.username,
    //         receivername: receiverName,
    //         body: message,
    //         isRead: false,
    //         createdAt: new Date(),
    //     };
    //     messageBody.message.push(messageContents);
    //     return await this.messageModel.create(messageBody)
    //                     .then(async (messageRes: Message) => {
    //                         await this.userModel.updateOne({ _id: user._id }, {
    //                             $push: {
    //                                 chatList: {
    //                                     $each: [{
    //                                         receiverId,
    //                                         messageId: messageRes._id,
    //                                     }],
    //                                     $position: 0,
    //                                 },
    //                             },
    //                         });

    //                         await this.userModel.updateOne({ _id: receiverId }, {
    //                             $push: {
    //                                 chatList: {
    //                                     $each: [{
    //                                         receiverId: user._id,
    //                                         messageId: messageRes._id,
    //                                     }],
    //                                     $position: 0,
    //                                 },
    //                             },
    //                         });
    //                         return messageRes;
    //                     }).catch(error => {
    //                         throw new InternalServerErrorException({ message: `Error message occured ${error}`});
    //                     });
    // }
}
