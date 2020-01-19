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

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UsersModule,
    PostsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserMiddleware)
      .forRoutes(PostsController, UsersController, ChatController);
  }
}
