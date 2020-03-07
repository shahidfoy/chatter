import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageContents } from './models/message.model';
import { Conversation } from './models/conversation.model';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel('Message') private readonly messageModel: Model<Message>,
        @InjectModel('Conversation') private readonly conversationModel: Model<Conversation>,
    ) {}

    // TODO:: refactor service to use the new message model
    // remove conversations model

    /**
     * gets conversations list for selected user id
     * @param userId user id
     */
    async getConversationsList(userId: string): Promise<Conversation[]> {
        const conversationsList = await this.conversationModel.find({
            $or: [
                { senderId: userId },
                { receiverId: userId },
            ],
        }).populate('messageId');
        // console.log('conversations', conversationsList);

        return conversationsList;
    }

    // TODO:: GET CHAT LIST

    /**
     * gets messages between two users
     * @param senderId senders id
     * @param receiverId receivers id
     */
    async getMessages(senderId: string, receiverId: string): Promise<Conversation> {
        const conversations = await this.conversationModel.findOne({
            $or: [
                {
                    $and: [
                        { senderId },
                        { receiverId },
                    ],
                },
                {
                    $and: [
                        { senderId: receiverId },
                        { receiverId: senderId },
                    ],
                },
            ],
        // }).select('_id');
        })
        .populate('messageId')
        .populate('senderId')
        .populate('receiverId');
        // .populate('messageId.message.senderId');
        console.log('CONVERSATIONS', conversations);
        return conversations;
        // TODO:: ADD CATCH ERROR MESSAGE

        // if (conversation) {
        //     const messages = await this.messageModel.findOne({ conversationId: conversation._id }).populate('message.senderId');
        //     return messages;
        // }
        // return null;
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
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        });
        // console.log('conversations - sendMessage', conversations);

        if (conversations.length > 0) {
            // const messageContent = await this.messageModel.findOne({ conversationId: conversations[0]._id });
            // this.updateChatList(user, receiverId, messageContent);
            // MIGHT ERROR HERE
            return await this.messageModel.updateOne({
                // conversationId: conversations[0]._id,
                _id: conversations[0].messageId,
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
                // return await this.messageModel.findOne({ conversationId: conversations[0]._id });
                await this.conversationModel.updateOne({ _id: conversations[0]._id }, { createdAt: new Date() });
                return await this.messageModel.findOne({ _id: conversations[0].messageId });
            }).catch(error => {
                throw new InternalServerErrorException({ message: `Error message occured ${error}`});
            });
        } else {
            const messageBody: Partial<Message> = {
                // conversationId: newConversation._id,
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
                                // console.log('MESSAGE', messageRes);
                                const body: Partial<Conversation> = {
                                    senderId,
                                    receiverId,
                                    messageId: messageRes._id,
                                    createdAt: new Date(),
                                };
                                await this.conversationModel.create(body);
                                return messageRes;
                            }).catch(error => {
                                throw new InternalServerErrorException({ message: `Error message occured ${error}`});
                            });
        }
    }
}
