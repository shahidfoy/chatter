import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { CloudinaryResponse } from './interfaces/cloudinary-response';

@Controller('images')
export class ImagesController {
    constructor(private imagesService: ImagesService) {}

    @Post('upload-profile-image')
    async uploadProfileImage(
        @Req() req: CustomRequest,
        @Body('image') image: string,
    ): Promise<CloudinaryResponse> {
        return this.imagesService.uploadProfileImage(req, image);
    }

    @Post('upload-post-image')
    async uploadPostImage(
        @Body('postImage') postImage: string,
    ): Promise<CloudinaryResponse> {
        return this.imagesService.uploadPostImage(postImage);
    }
}
