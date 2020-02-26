import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './models/notification.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    ) {}

    /**
     * get notifications by user
     * TODO:: ADD PAGINATION
     * @param userId user id
     */
    async getNotificaitons(userId: string): Promise<Notification> {
        return await this.notificationModel
                        .find({userId})
                        .sort({createdAt: -1})
                        .catch((err) => {
                            throw new InternalServerErrorException({ message: 'Unable to get user notifications' });
                        });
    }

    /**
     * get notification count by user
     * @param userId user id
     */
    async getNotificationsCount(userId: string): Promise<number> {
        return await this.notificationModel.countDocuments({userId})
                        .catch((err) => {
                            throw new InternalServerErrorException({ message: 'Unable to get user notifications count' });
                        });
    }

    /**
     * creates new follow notification and sends it to receiver id
     * @param user user sending notificaiton
     * @param receiverId receiver of notification
     */
    async createFollowNotification(user: User, receiverId: string): Promise<string> {
        const followNotification = async () => {
            await this.notificationModel.create({
                userId: receiverId,
                senderId: user._id,
                senderUsername: user.username,
                picVersion: user.picVersion,
                picId: user.picId,
                message: `${user.username} is now following you.`,
                createdAt: new Date(),
            });
        };

        return followNotification()
            .then(() => {
                return JSON.stringify(receiverId);
            })
            .catch((err) => {
                throw new InternalServerErrorException({ message: 'Unable to send follow notification' });
            });
    }

    // TODO:: clean up read notifications
    /**
     * deletes notification by id
     * @param notificationId notification id
     */
    async deleteNotification(notificationId: string): Promise<string> {
      const deleteNotification = async () => {
        await this.notificationModel.deleteOne({_id: notificationId});
      };

      return deleteNotification()
        .then(() => {
          return JSON.stringify(notificationId);
        })
        .catch((err) => {
          throw new InternalServerErrorException({ message: `Unable to delete notification` });
        });
    }

    // delete all notifications
}
