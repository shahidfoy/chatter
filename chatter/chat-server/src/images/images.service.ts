import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import * as Cloudinary from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary.config';

const cloudinary = Cloudinary.v2;

@Injectable()
export class ImagesService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    async uploadProfileImage(image: any): Promise<any> {
        console.log('upload profile image service');

        if (image) {
            console.log(image);
        }
        return undefined;
    }
}
