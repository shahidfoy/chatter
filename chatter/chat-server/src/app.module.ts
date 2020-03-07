import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig } from './config/db.config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { PostsController } from './posts/posts.controller';
import { UsersController } from './users/users.controller';
import { ChatModule } from './chat/chat.module';
import { ChatController } from './chat/chat.controller';
import { ImagesModule } from './images/images.module';
import { ImagesController } from './images/images.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContactsModule } from './contacts/contacts.module';
import { ContactsController } from './contacts/contacts.controller';

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    ChatModule,
    ImagesModule,
    NotificationsModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserMiddleware)
      .forRoutes(
        AuthController,
        PostsController,
        UsersController,
        ContactsController,
        ChatController,
        ImagesController);
  }
}
