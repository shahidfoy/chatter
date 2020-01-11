import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

    @SubscribeMessage('chat')
    async onMessage(client: Socket) {
        this.server.emit('chat');
    }
}
