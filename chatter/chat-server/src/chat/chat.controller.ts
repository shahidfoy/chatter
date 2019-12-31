import { Controller, Post, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) {}

    /**
     * sends a chat message to the receiver
     * @param senderId senders id
     * @param receiverId receivers id
     */
    @Post('message/:senderId/:receiverId')
    async sendMessage(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
    ): Promise<any> {
        return this.chatService.sendMessage(senderId, receiverId);
    }
}
