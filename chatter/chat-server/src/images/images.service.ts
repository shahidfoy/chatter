import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import * as Cloudinary from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary.config';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { CloudinaryResponse } from './interfaces/cloudinary-response';

const cloudinary = Cloudinary.v2;
cloudinary.config = cloudinaryConfig;

@Injectable()
export class ImagesService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    async uploadProfileImage(req: CustomRequest, image: string): Promise<CloudinaryResponse> {
        if (image) {
            return new Promise((resolve, reject) => {

                cloudinary.uploader.upload(image, async (error: any, result: CloudinaryResponse) => {

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
}
