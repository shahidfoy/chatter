import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './models/notification.model';

@Controller('notifications')
export class NotificationsController {

    constructor(private notificationsService: NotificationsService) {

    }

    /**
     * gets user notifications
     * @param userId user id
     */
    @Get('/:userId')
    async getNotifications(
        @Param('userId') userId: string,
    ): Promise<Notification> {
        return this.notificationsService.getNotificaitons(userId);
    }

    /**
     * gets user notification count
     * @param userId user id
     */
    @Get('count/:userId')
    async getNotificationsCount(
        @Param('userId') userId: string,
    ): Promise<number> {
        return this.notificationsService.getNotificationsCount(userId);
    }
}
