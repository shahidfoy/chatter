import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageContents } from './models/message.model';
import { Conversation } from './models/conversation.model';

@Injectable()
export class ChatService {
  private readonly MAX_MESSAGE_LENGTH = 10;
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('Conversation')
    private readonly conversationModel: Model<Conversation>,
  ) {}

  /**
   * gets conversations list for selected user id
   * @param userId user id
   */
  async getConversationsList(userId: string): Promise<Conversation[]> {
    const conversationsList = await this.conversationModel
      .find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
      .populate('messageId')
      .populate('senderId')
      .populate('receiverId')
      .sort({ createdAt: -1 });
    return conversationsList;
  }

  /**
   * gets messages between two users
   * @param senderId senders id
   * @param receiverId receivers id
   */
  async getMessages(
    senderId: string,
    receiverId: string,
  ): Promise<Conversation> {
    const conversations = await this.conversationModel
      .findOne({
        $or: [
          {
            $and: [{ senderId }, { receiverId }],
          },
          {
            $and: [{ senderId: receiverId }, { receiverId: senderId }],
          },
        ],
      })
      .populate('messageId')
      .populate('senderId')
      .populate('receiverId');
    return conversations;
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
          $and: [
            { 'message.sendername': receiver, 'message.receivername': sender },
          ],
        },
      },
    ]);

    if (messages.length > 0) {
      try {
        messages.forEach(async (messageContents: any) => {
          await this.messageModel.updateOne(
            {
              'message._id': messageContents.message._id,
            },
            {
              $set: { 'message.$.isRead': true },
            },
          );
        });
      } catch (err) {
        throw new InternalServerErrorException(
          'Error: marking receiver messages',
        );
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
  async sendMessage(
    user: User,
    senderId: string,
    receiverId: string,
    receiverName: string,
    message: string,
  ): Promise<Message> {
    if (message.length > this.MAX_MESSAGE_LENGTH) {
      throw new BadRequestException({
        message: 'Error message occured ${error}',
      });
    }
    const conversations = await this.conversationModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (conversations.length > 0) {
      return await this.messageModel
        .updateOne(
          {
            _id: conversations[0].messageId,
          },
          {
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
          },
        )
        .then(async () => {
          await this.conversationModel.updateOne(
            { _id: conversations[0]._id },
            { createdAt: new Date() },
          );
          return await this.messageModel.findOne({
            _id: conversations[0].messageId,
          });
        })
        .catch(error => {
          throw new InternalServerErrorException({
            message: `Error message occured ${error}`,
          });
        });
    } else {
      const messageBody: Partial<Message> = {
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
      return await this.messageModel
        .create(messageBody)
        .then(async (messageRes: Message) => {
          const body: Partial<Conversation> = {
            senderId,
            receiverId,
            messageId: messageRes._id,
            createdAt: new Date(),
          };
          await this.conversationModel.create(body);
          return messageRes;
        })
        .catch(error => {
          throw new InternalServerErrorException({
            message: `Error message occured ${error}`,
          });
        });
    }
  }
}
