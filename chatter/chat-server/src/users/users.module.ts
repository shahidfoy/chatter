import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { UsersGateway } from './gateways/users.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UsersService, UsersGateway],
  controllers: [UsersController],
})
export class UsersModule {}
