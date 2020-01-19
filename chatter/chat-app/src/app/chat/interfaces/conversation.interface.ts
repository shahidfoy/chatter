export interface Conversation {
  _id: string;
  participants: Participants[];
}

export interface Participants {
  _id: string;
  senderId: string;
  receiverId: string;
}
