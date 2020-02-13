import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/models/user.model';
import { PostSchema } from 'src/posts/models/post.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
    ]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
