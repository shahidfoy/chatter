import { Injectable } from '@nestjs/common';
import { User } from 'src/users/models/user.model';

@Injectable()
export class ChatService {

    constructor() {}

    /**
     * sends a chat message to the reciever
     * @param senderId senders id
     * @param recieverId recievers id
     */
    async sendMessage(user: User, senderId: string, recieverId: string, recieverName: string, message: string): Promise<any> {
        console.log('sending message');
        return null;
    }
}
