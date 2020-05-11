import { Message } from './message.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

export interface Conversation {
  _id: string;
  senderId: User;
  receiverId: User;
  messageId: Message;
  createdAt: Date;
}
