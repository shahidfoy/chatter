import { Controller, Post, Body, Req, Get, Param, Put, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { UserPost } from './models/post.model';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    /**
     * gets all posts
     */
    @Get('all/:page')
    async getPosts(
        @Param('page') page: number = 0,
    ): Promise<UserPost[]> {
        return this.postsService.getPosts(page);
    }

    /**
     * gets posts by user id
     * @param userId user id
     */
    @Get('userId/:userId/:page')
    async getPostsByUserId(
        @Param('userId') userId: string,
        @Param('page') page: number = 0,
    ): Promise<UserPost[]> {
        return this.postsService.getPostsByUserId(userId, page);
    }

    /**
     * gets trending posts
     */
    @Get('trending/:page')
    async getTrendingPosts(
        @Param('page') page: number = 0,
    ): Promise<UserPost[]> {
        return this.postsService.getTrendingPosts(page);
    }

    /**
     * gets posts by id
     * @param postId post id
     */
    @Get(':id')
    async getPostById(
        @Param('id') postId: string,
    ): Promise<UserPost> {
        return this.postsService.getPostById(postId);
    }

    /**
     * creates new post
     * @param req custom request
     * @param post new post
     * @param tags tags for post
     * @param picVersion picture cloudinary version
     * @param picId picture cloudinary id
     */
    @Post('add-post')
    async addPost(
        @Req() req: CustomRequest,
        @Body('post') post: string,
        @Body('tags') tags: string[],
        @Body('picVersion') picVersion: number,
        @Body('picId') picId: string,
    ): Promise<Partial<UserPost>> {
        return this.postsService.addPost(req.user, post, tags, picVersion, picId);
    }

    /**
     * edits selected post
     * @param req custom request
     * @param post new post
     * @param tags tags for post
     * @param picVersion picture cloudinary version
     * @param picId picture cloudinary id
     */
    @Put('edit-post')
    async editPost(
        @Req() req: CustomRequest,
        @Body('postId') postId: string,
        @Body('post') post: string,
        @Body('tags') tags: string[],
        @Body('picVersion') picVersion: number,
        @Body('picId') picId: string,
    ): Promise<Partial<UserPost>> {
        return this.postsService.editPost(postId, post, tags, picVersion, picId);
    }

    /**
     * deletes post by id
     * @param postId post id
     */
    @Delete('delete-post/:postId')
    async deletePost(
        @Req() req: CustomRequest,
        @Param('postId') postId: string,
    ): Promise<void> {
        return this.postsService.deletePost(req.user._id, postId);
    }

    /**
     * adds like to post
     * @param req custom request
     * @param postId post id
     */
    @Post('like')
    async addLike(
        @Req() req: CustomRequest,
        @Body('_id') postId: string,
    ): Promise<string> {
        return this.postsService.addLike(req.user, postId);
    }

    /**
     * adds dislike to post
     * @param req custom request
     * @param postId post id
     */
    @Post('dislike')
    async addDisLike(
        @Req() req: CustomRequest,
        @Body('_id') postId: string,
    ): Promise<string> {
        return this.postsService.addDislike(req.user, postId);
    }

    /**
     * adds a comment to a post
     * @param req custom request
     * @param postId post id for comment
     * @param comment user comment
     */
    @Post('add-comment')
    async addComment(
        @Req() req: CustomRequest,
        @Body('postId') postId: string,
        @Body('comment') comment: string,
    ): Promise<string> {
        return this.postsService.addComment(req.user, postId, comment);
    }
}
