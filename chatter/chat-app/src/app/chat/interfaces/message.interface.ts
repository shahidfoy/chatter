import { User } from '../../shared/interfaces/user.interface';

export interface Message {
  _id: string;
  senderId: User;
  receiverId: User;
  sender: string;
  receiver: string;
  cratedAt: Date;
  message: MessageContents[];
}

export interface MessageContents {
  _id: string;
  senderId: string;
  receiverId: string;
  sendername: string;
  receivername: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
}
