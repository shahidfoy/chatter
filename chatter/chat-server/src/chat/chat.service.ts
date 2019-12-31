import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {

    constructor() {}

    /**
     * sends a chat message to the reciever
     * @param senderId senders id
     * @param recieverId recievers id
     */
    async sendMessage(senderId: string, recieverId: string): Promise<any> {
        return null;
    }
}
