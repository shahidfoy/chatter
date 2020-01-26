import { Controller, Get, Body } from '@nestjs/common';

@Controller('images')
export class ImagesController {

    /**
     * gets users profile image by username
     * @param username username
     */
    @Get(':username')
    async getUserProfileImage(
        @Body('username') username: string,
    ): Promise<any> {
        return undefined;
    }
}
