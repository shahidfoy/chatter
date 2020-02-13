import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import * as Cloudinary from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary.config';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { CloudinaryResponse } from './interfaces/cloudinary-response';
import { UserPost } from '../posts/models/post.model';

const cloudinary = Cloudinary.v2;
cloudinary.config = cloudinaryConfig;

@Injectable()
export class ImagesService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Post') private readonly postModel: Model<UserPost>,
    ) {}

    /**
     * upload profile image
     * @param req custom request
     * @param image user profile image
     */
    async uploadProfileImage(req: CustomRequest, image: string): Promise<CloudinaryResponse> {
        if (image) {

            const user = await this.userModel.findOne({
                _id: req.user._id,
            });
            cloudinary.uploader.destroy(user.picId);

            return new Promise((resolve, reject) => {

                cloudinary.uploader.upload(image, async (error: Cloudinary.ErrorCallBack, result: CloudinaryResponse) => {
                    if (error) {
                        throw new InternalServerErrorException({ message: `Error retrieving profile image ${error}` });
                    }

                    await this.userModel.updateOne({
                        _id: req.user._id,
                    }, {
                        picId: result.public_id,
                        picVersion: result.version,
                    }).then(() => {
                        resolve(result);
                    }).catch(err => {
                        throw new InternalServerErrorException({ message: `Error retrieving profile image ${err}`});
                    });
                });
            });
        }
    }

    /**
     * uploads post image
     * @param image post image
     */
    async uploadPostImage(image: string): Promise<CloudinaryResponse> {
        if (image) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(image, async (error: Cloudinary.ErrorCallBack, result: CloudinaryResponse) => {
                    if (error) {
                        throw new InternalServerErrorException({ message: `Error retrieving profile image ${error}` });
                    }
                    resolve(result);
                });
            });
        }
    }

    /**
     * edits post image
     * deletes old post image and uploads a new one
     * @param image post image
     */
    async editPostImage(post: UserPost, image: string): Promise<CloudinaryResponse> {
        if (image) {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(image, async (error: Cloudinary.ErrorCallBack, result: CloudinaryResponse) => {
                    if (error) {
                        throw new InternalServerErrorException({ message: `Error retrieving profile image ${error}` });
                    }

                    cloudinary.uploader.destroy(post.picId);
                    resolve(result);
                });
            });
        }

        return null;
    }
}
