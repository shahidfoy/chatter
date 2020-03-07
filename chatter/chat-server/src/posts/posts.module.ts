import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostSchema } from './models/post.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './models/tag.model';
import { UserSchema } from '../users/models/user.model';
import { PostsGateway } from './gateways/posts.gateway';
import { CommentsGateway } from './gateways/comments.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Tag', schema: TagSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsGateway, CommentsGateway],
})
export class PostsModule {}
