import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    counter = 0;

    async handleConnection() {
        this.counter++;
        // console.log('comment socket handling connections', this.counter);
    }

    async handleDisconnect() {
        this.counter--;
        // console.log('comment socket disconnecting', this.counter);
    }

    @SubscribeMessage('comment')
    async onComment(client: Socket) {
        this.server.emit('comment');
    }
}
