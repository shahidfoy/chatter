import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPost } from './models/post.model';
import { User } from '../users/models/user.model';
import * as Joi from '@hapi/joi';
import { Tag } from './models/tag.model';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Post') private readonly postModel: Model<UserPost>,
        @InjectModel('Tag') private readonly tagModel: Model<Tag>,
    ) {}

    /**
     * adds user post
     * @param user user who posted
     * @param post post data
     * @param tags tags related to post
     */
    async addPost(user: User, post: string, tags: string[]): Promise<Partial<UserPost>> {
        const schema = Joi.object().keys({
            post: Joi.string().required(),
        });
        const { error } = schema.validate({ post });

        if (error && error.details) {
            throw new BadRequestException({ message: error.details[0].message });
        }

        if (tags) {
            tags = tags.map(tag => tag.toLowerCase());
            tags.forEach(async (tag: string) => {
                const existingTag = await this.tagModel.findOne({ tag });
                if (!existingTag) {
                    this.tagModel.create({ tag });
                }
            });
        }

        const body: Partial<UserPost> = {
            user,
            username: user.username,
            post,
            tags,
            createdAt: new Date(),
        };

        return await this.postModel.create(body).then(async (newPost: UserPost) => {
            await this.userModel.updateOne(
                { _id: user._id },
                { $push: {
                    posts: {
                            postId: newPost._id,
                            post: newPost.post,
                            createdAt: new Date(),
                        },
                    },
                });

            return newPost;
        }).catch(err => {
            throw new InternalServerErrorException({ message: `Posting Error Occured ${err}` });
        });
    }

    /**
     * gets all user posts
     */
    async getPosts(): Promise<UserPost[]> {
        try {
            const posts = await this.postModel.find({})
                .populate('user')
                .sort({ createdAt: -1 });
            return posts;
        } catch (err) {
            throw new InternalServerErrorException({ message: `Retrieving posts Error Occured ${err}`});
        }
    }

    /**
     * adds like to post
     * @param user user who liked post
     * @param postId post id
     */
    async addLike(user: User, postId: string): Promise<string> {
        return await this.postModel.updateOne({
            '_id': postId,
            'likes.username': { $ne: user.username },
        }, {
            $push: { likes: { username: user.username } },
            $inc: { totalLikes: 1 },
        }).then(() => {
            return JSON.stringify(postId);
        }).catch(err => {
            throw new InternalServerErrorException({ message: `Like Error Occured ${err}` });
        });
    }

    /**
     * adds dislike to post
     * @param user user who disliked post
     * @param postId post id
     */
    async addDislike(user: User, postId: string): Promise<string> {
        return await this.postModel.updateOne({
            '_id': postId,
            'dislikes.username': { $ne: user.username },
        }, {
            $push: { dislikes: { username: user.username } },
            $inc: { totalDislikes: 1 },
        }).then(() => {
            return JSON.stringify(postId);
        }).catch(err => {
            throw new InternalServerErrorException({ message: `Dislike Error Occured ${err}`});
        });
    }
}
