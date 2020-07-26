import { Controller, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Tag } from 'src/groups/models/tag.model';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    /**
     * gets all tags for groups
     */
    @Get('tags')
    async getGroupTags(): Promise<Tag[]> {
        return this.groupsService.getGroupTags();
    }
}
