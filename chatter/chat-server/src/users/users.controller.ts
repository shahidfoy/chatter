import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.model';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    /**
     * gets all users
     * TODO:: IMPLEMENT PAGAINATION
     */
    @Get()
    async getUsers(): Promise<User[]> {
        return await this.usersService.getUsers();
    }
}
