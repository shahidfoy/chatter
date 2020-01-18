import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatParams } from '../interfaces/chat-params.interface';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    counter = 0;

    async handleConnection() {
        this.counter++;
        // console.log('user socket handling connections', this.counter);
    }

    async handleDisconnect() {
        this.counter--;
        // console.log('user socket disconnecting', this.counter);
    }

    @SubscribeMessage('join_chat')
    async onJoinChat(client: Socket, chatParams: ChatParams) {
        client.join(chatParams.sender);
        client.join(chatParams.receiver);
    }

    @SubscribeMessage('chat')
    async onMessage(client: Socket) {
        this.server.emit('chat');
    }

    @SubscribeMessage('typing')
    async onTyping(client: Socket, chatParams: ChatParams) {
        this.server.to(chatParams.receiver).emit('typing', chatParams);
    }

    @SubscribeMessage('stop_typing')
    async onStopTyping(client: Socket, chatParams: ChatParams) {
        this.server.to(chatParams.receiver).emit('stop_typing', chatParams);
    }
}
