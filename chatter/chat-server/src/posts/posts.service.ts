import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPost } from './models/post.model';
import { User } from '../users/models/user.model';
import * as Joi from '@hapi/joi';
import { Tag } from './models/tag.model';

@Injectable()
export class PostsService {

    private limit = 15;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Post') private readonly postModel: Model<UserPost>,
        @InjectModel('Tag') private readonly tagModel: Model<Tag>,
    ) {}

    /**
     * gets all user posts
     */
    async getPosts(page: number = 0): Promise<UserPost[]> {
        const skip = page * this.limit;
        try {
            const posts = await this.postModel.find({}, {},
                { skip, limit: this.limit })
                .populate('user')
                .sort({ createdAt: -1 });
            return posts;
        } catch (err) {
            throw new InternalServerErrorException({ message: `Retrieving posts Error Occured ${err}`});
        }
    }

    /**
     * gets posts by user id
     * @param userId user id
     * @param page current page
     */
    async getPostsByUserId(userId: string, page: number = 0): Promise<UserPost[]> {
        const skip = page * this.limit;
        try {
            const posts = await this.postModel.find({ user: userId }, {},
                { skip, limit: this.limit })
                .populate('user')
                .sort({ createdAt: -1 });
            return posts;
        } catch (err) {
            throw new InternalServerErrorException({ message: `Retrieving posts Error Occured ${err}`});
        }
    }

    /**
     * gets all trending posts
     * currently gets most likes
     */
    async getTrendingPosts(page: number = 0): Promise<UserPost[]> {
        const skip = page * this.limit;
        try {
            const posts = await this.postModel.find({ totalLikes: { $gte: 3 } }, {},
                { skip, limit: this.limit })
                .populate('user')
                .sort({ totalLikes: -1 });
            return posts;
        } catch (err) {
            throw new InternalServerErrorException({ message: `Retrieving posts Error Occured ${err}`});
        }
    }

    /**
     * gets post by id
     * @param postId post id
     */
    async getPostById(postId: string): Promise<UserPost> {
        return await this.postModel.findOne({ _id: postId })
            .populate('user')
            .populate('comments.userId')
            .then((post) => {
                return post;
            })
            .catch(err => {
                throw new InternalServerErrorException({ message: `Retrieving post Error Occured ${err}`});
            });
    }

    /**
     * adds user post
     * @param user user who posted
     * @param post post data
     * @param tags tags related to post
     */
    async addPost(user: User, post: string, tags: string[], picVersion: number, picId: string): Promise<Partial<UserPost>> {
        const schema = Joi.object().keys({
            post: Joi.string().required().max(300),
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
            picVersion,
            picId,
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
     * edits selected post
     * @param user user who posted
     * @param post new post
     * @param tags tags for post
     * @param picVersion picture cloudinary version
     * @param picId picture cloudinary id
     */
    async editPost(postId: string, post: string, tags: string[], picVersion: number, picId: string): Promise<Partial<UserPost>> {
        const schema = Joi.object().keys({
            post: Joi.string().required().max(300),
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

        return await this.postModel.findOneAndUpdate(
            { _id: postId },
            {
                post,
                tags,
                picVersion,
                picId,
            },
            { new: true },
        ).catch(err => {
            throw new InternalServerErrorException({ message: `Unable to edit post` });
        });
    }

    /**
     * deletes post by id
     * @param postId post id
     */
    async deletePost(userId: string, postId: string): Promise<void> {
        try {
            const deletedPost = await this.postModel.findByIdAndRemove(postId);
            if (!deletedPost) {
                throw new NotFoundException({ message: 'Unable to delete post. post not found' });
            }

            await this.userModel.updateOne({
                _id: userId,
            }, {
                $pull: { posts: { postId: deletedPost._id } },
            });
        } catch (err) {
            throw new InternalServerErrorException({ message: 'Unable to delete post. Please try again later' });
        }
    }

    /**
     * adds like to post
     * @param user user who liked post
     * @param postId post id
     */
    async addLike(user: User, postId: string): Promise<string> {
        const userDisliked = await this.postModel.find({ 'dislikes.username': user.username });

        if (userDisliked) {
            this.postModel.updateOne({
                '_id': postId,
                'dislikes.username': { $eq: user.username },
            }, {
                $pull: { dislikes: { username: user.username } },
                $inc: { totalDislikes: -1 },
            }).then().catch(err => {
                throw new InternalServerErrorException({ message: `Like Error Occured removing dislike ${err}` });
            });
        }

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
        const userLiked = await this.postModel.find({ 'likes.username': user.username });

        if (userLiked) {
            this.postModel.updateOne({
                '_id': postId,
                'likes.username': { $eq: user.username },
            }, {
                $pull: { likes: { username: user.username } },
                $inc: { totalLikes: -1 },
            }).then().catch(err => {
                throw new InternalServerErrorException({ message: `Dislike Error Occured removing like ${err}` });
            });
        }

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

    /**
     * adds comment to a post
     * @param user user adding comment
     * @param postId id of post where comment is being added
     * @param comment comment being added to post
     */
    async addComment(user: User, postId: string, comment: string): Promise<string> {
        const schema = Joi.object().keys({
            comment: Joi.string().required().max(300),
        });
        const { error } = schema.validate({ comment });

        if (error && error.details) {
            throw new BadRequestException({ message: error.details[0].message });
        }

        return await this.postModel.updateOne({
            _id: postId,
        }, {
            $push: {
                comments: {
                    userId: user._id,
                    username: user.username,
                    comment,
                    createdAt: new Date(),
                },
            },
        }).then(() => {
            return JSON.stringify(postId);
        }).catch(err => {
            throw new InternalServerErrorException({ message: `Add comment Error Occured ${err}`});
        });
    }
}
