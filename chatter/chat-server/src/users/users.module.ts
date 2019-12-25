import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersGateway } from './gateways/users.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UsersService, AuthService, UsersGateway],
  controllers: [UsersController, AuthController],
})
export class UsersModule {}
