export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
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
