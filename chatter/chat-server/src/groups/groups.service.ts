import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from 'src/groups/models/tag.model';
import { Model } from 'mongoose';

@Injectable()
export class GroupsService {

    constructor(@InjectModel('Tag') private readonly tagModel: Model<Tag>) {}

    /**
     * gets tags for groups
     */
    async getGroupTags(): Promise<Tag[]> {
        try {
            const tags = await this.tagModel.find().sort({ tag: 1 });
            return tags;
        } catch (err) {
            throw new InternalServerErrorException({ message: `Retrieving tags Error Occured ${err}` });
        }
    }
}
