export interface User {
  _id: string;
  username?: string;
  email?: string;
  password?: string;
  onlineStatus?: string;
  picVersion?: string;
  picId?: string;
}

// TODO:: REFACTOR INTO OWN INTERFACE
export interface MessageId extends User {
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
  message: MessageBody[];
}

export interface MessageBody {
  _id: string;
  body: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  sendername: string;
  receivername: string;
  isRead: boolean;
}
