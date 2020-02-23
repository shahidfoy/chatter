import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { FollowerSchema } from './models/follower.model';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowingSchema } from './models/following.model';
import { UserSchema } from 'src/users/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Follower', schema: FollowerSchema },
      { name: 'Following', schema: FollowingSchema },
    ]),
  ],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
