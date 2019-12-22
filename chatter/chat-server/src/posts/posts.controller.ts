import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { UserPost } from './models/post.model';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post('add-post')
    async addPost(
        @Req() req: CustomRequest,
        @Body('post') post: string,
        @Body('tags') tags: string[],
    ): Promise<Partial<UserPost>> {
        return this.postsService.addPost(req.user, post, tags);
    }

    @Get()
    async getPosts(): Promise<UserPost[]> {
        return this.postsService.getPosts();
    }

    @Post('like')
    async addLike(
        @Req() req: CustomRequest,
        @Body('_id') postId: string,
    ): Promise<string> {
        return this.postsService.addLike(req.user, postId);
    }

    @Post('dislike')
    async addDisLike(
        @Req() req: CustomRequest,
        @Body('_id') postId: string,
    ): Promise<string> {
        return this.postsService.addDislike(req.user, postId);
    }
}
