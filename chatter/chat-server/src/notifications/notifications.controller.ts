import { Controller, Get, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './models/notification.model';

@Controller('notifications')
export class NotificationsController {

    constructor(private notificationsService: NotificationsService) {}

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

    /**
     * deletes notification by id
     * @param notificationId notification id
     */
    @Delete('delete/:notificationId')
    async deleteNotification(
        @Param('notificationId') notificationId: string,
    ): Promise<string> {
        return this.notificationsService.deleteNotification(notificationId);
    }

    /**
     * deletes all notifications by user id
     * @param userId user id
     */
    @Delete('delete-all/:userId')
    async deleteAllNotifications(
        @Param('userId') userId: string,
    ): Promise<string> {
        return this.notificationsService.deleteAllNotifications(userId);
    }
}
