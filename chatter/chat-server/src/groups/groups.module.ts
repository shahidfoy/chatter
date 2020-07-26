import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from 'src/groups/models/tag.model';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tag', schema: TagSchema }
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
