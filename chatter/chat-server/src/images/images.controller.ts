import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { CloudinaryResponse } from './interfaces/cloudinary-response';
import { UserPost } from 'src/posts/models/post.model';

@Controller('images')
export class ImagesController {
    constructor(private imagesService: ImagesService) {}

    /**
     * uploads user's profile image
     * @param req custom request
     * @param image image string
     */
    @Post('upload-profile-image')
    async uploadProfileImage(
        @Req() req: CustomRequest,
        @Body('image') image: string,
    ): Promise<CloudinaryResponse> {
        return this.imagesService.uploadProfileImage(req, image);
    }

    /**
     * uploads post image
     * @param postImage post's image
     */
    @Post('upload-post-image')
    async uploadPostImage(
        @Body('postImage') postImage: string,
    ): Promise<CloudinaryResponse> {
        return this.imagesService.uploadPostImage(postImage);
    }

    /**
     * edits post image
     * @param post user's post
     * @param postImage new post image
     */
    @Post('edit-post-image')
    async editPostImage(
        @Body('post') post: UserPost,
        @Body('postImage') postImage: string,
    ): Promise<CloudinaryResponse> {
        return this.imagesService.editPostImage(post, postImage);
    }
}
