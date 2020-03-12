import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from './models/conversation.model';
import { MessageSchema } from './models/message.model';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
