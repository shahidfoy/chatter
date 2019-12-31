import { Controller, Post, Param, Body, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';

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
        @Req() req: CustomRequest,
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
        @Body('receiverName') receiverName: string,
        @Body('message') message: string,
    ): Promise<any> {
        console.log('sending message');
        return this.chatService.sendMessage(req.user, senderId, receiverId, receiverName, message);
    }
}
