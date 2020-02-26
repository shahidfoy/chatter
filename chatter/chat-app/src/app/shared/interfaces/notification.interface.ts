export interface Notification {
  _id: string;
  userId: string;
  senderId: string;
  senderUsername: string;
  picVersion: string;
  picId: string;
  message: string;
  viewProfile: boolean;
  createdAt: Date;
  read: boolean;
  date: string;
}
