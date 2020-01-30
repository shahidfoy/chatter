import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
    constructor() {}

    async uploadProfileImage(image: any): Promise<any> {
        console.log('upload profile image service');

        if (image) {}
        return undefined;
    }
}
