import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/models/user.model';
import { ConversationSchema } from './models/conversation.model';
import { MessageSchema } from './models/message.model';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatListSchema } from './models/chat-list.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ChatList', schema: ChatListSchema },
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
