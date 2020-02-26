import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    // counter = 0;

    async handleConnection() {
        // this.counter++;
        // console.log('user socket handling connections', this.counter);
    }

    async handleDisconnect() {
        // this.counter--;
        // console.log('user socket disconnecting', this.counter);
    }

    @SubscribeMessage('notification')
    async onNotificationAction(client: Socket) {
        this.server.emit('notification');
    }
}