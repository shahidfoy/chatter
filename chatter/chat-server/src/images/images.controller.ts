import { Controller, Get, Body, Post } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
    constructor(private imagesService: ImagesService) {}

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

    @Post('upload-profile-image')
    async uploadProfileImage(
        @Body('image') image: any,
    ): Promise<any> {
        return this.imagesService.uploadProfileImage(image);
    }
}
