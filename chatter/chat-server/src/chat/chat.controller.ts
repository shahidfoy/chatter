import { Controller, Post, Param, Body, Req, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { Message } from './models/message.model';

@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) {}

    /**
     * gets chat messages between two users
     * @param senderId senders id
     * @param receiverId receivers id
     */
    @Get('message/:senderId/:receiverId')
    async getMessages(
        @Req() req: CustomRequest,
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
    ): Promise<Message> {
        return this.chatService.getMessages(senderId, receiverId);
    }

    /**
     * marks receivers of logged in users messages as read
     * @param sender logged in user
     * @param receiver receiver of logged in users messages
     */
    @Get('mark-receiver-messages/:sender/:receiver')
    async markReceiverMessages(
        @Param('sender') sender: string,
        @Param('receiver') receiver: string,
    ) {
        this.chatService.markReceiverMessages(sender, receiver);
    }

    /**
     * sends a chat message to the receiver
     * @param req custom request
     * @param senderId senders id
     * @param receiverId receivers id
     * @param receiverName receivers username
     * @param message message to be sent
     */
    @Post('message/:senderId/:receiverId')
    async sendMessage(
        @Req() req: CustomRequest,
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
        @Body('receiverName') receiverName: string,
        @Body('message') message: string,
    ): Promise<Message> {
        return this.chatService.sendMessage(req.user, senderId, receiverId, receiverName, message);
    }
}
