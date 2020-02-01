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
            const messages = await this.messageModel.findOne({ conversationId: conversation._id }).populate('message.senderId');
            return messages;
        }
        // might create new conversation if none located
        return null;
    }

    /**
     * marks receivers messages that are sent to the logged in user as read
     * @param sender logged in user
     * @param receiver receiver of logged in users messages
     */
    async markReceiverMessages(sender: string, receiver: string) {
        const messages = await this.messageModel.aggregate([
            { $unwind: '$message' },
            {
                $match: {
                    $and: [{ 'message.sendername': receiver, 'message.receivername': sender }],
                },
            },
        ]);

        if (messages.length > 0) {
            try {
                messages.forEach(async (messageContents: any) => {
                    await this.messageModel.updateOne({
                        'message._id': messageContents.message._id,
                    }, {
                        $set: {'message.$.isRead': true },
                    });
                });
            } catch (err) {
                throw new InternalServerErrorException('Error: marking receiver messages');
            }
        }
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
            const messageContent = await this.messageModel.findOne({ conversationId: conversations[0]._id });
            this.updateChatList(user, receiverId, messageContent);
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

    /**
     * updates logged in users and receivers chat list
     * removes chat contents with matching receiver id and adds new chat contents to the first
     * position of chat list
     * @param user logged in user
     * @param receiverId receiver id
     * @param message message contents
     */
    private async updateChatList(user: User, receiverId: string, message: Message) {
        await this.userModel.updateOne({
            _id: user._id,
        }, {
            $pull: {
                chatList: {
                    receiverId,
                },
            },
        });

        await this.userModel.updateOne({
            _id: receiverId,
        }, {
            $pull: {
                chatList: {
                    receiverId: user._id,
                },
            },
        });

        await this.userModel.updateOne({ _id: user._id }, {
            $push: {
                chatList: {
                    $each: [{
                        receiverId,
                        messageId: message._id,
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
                        messageId: message._id,
                    }],
                    $position: 0,
                },
            },
        });
    }
}
