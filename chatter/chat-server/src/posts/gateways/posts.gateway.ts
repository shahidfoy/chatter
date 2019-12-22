import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class PostsGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    counter = 0;

    async handleConnection() {
        this.counter++;
        console.log('socket handling connections', this.counter);
    }

    async handleDisconnect() {
        this.counter--;
        console.log('socket disconnecting', this.counter);
    }

    async afterInit(server: Server) {
        console.log('afterInit');
    }

    @SubscribeMessage('post')
    async onPost(client: Socket) {
        this.server.emit('post');
    }
}
