import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { CloudinaryResponse } from './interfaces/cloudinary-response';

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
        @Req() req: CustomRequest,
        @Body('image') image: string,
    ): Promise<CloudinaryResponse> {
        return this.imagesService.uploadProfileImage(req, image);
    }
}
