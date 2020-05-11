import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './models/notification.model';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsService {

  private readonly LIMIT = 10;

  constructor(
      @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
      private usersService: UsersService,
  ) {}

  /**
   * get notifications by user
   * @param userId user id
   */
  async getNotificaitons(userId: string, page: number = 0): Promise<Notification> {
      const skip = page * this.LIMIT;
      return await this.notificationModel
                      .find({userId}, {},
                        { skip, limit: this.LIMIT })
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

  /**
   * deletes all notifications by user id
   * @param userId user id
   */
  async deleteAllNotifications(userId: string): Promise<string> {
    const deleteAllNotifications = async () => {
      await this.notificationModel.deleteMany({userId});
    };

    return deleteAllNotifications()
      .then(() => {
        return JSON.stringify(userId);
      })
      .catch(() => {
        throw new InternalServerErrorException({ message: `Unable to delete all notifications`});
      });
  }

  /**
   * creates new follow notification and sends it to receiver id
   * @param user user sending notificaiton
   * @param receiverId receiver of notification
   */
  async createFollowNotification(user: User, receiverId: string): Promise<string> {
    const userData = await this.usersService.getUserById(user._id);
    const followNotification = async () => {
        await this.notificationModel.create({
            userId: receiverId,
            senderId: user._id,
            senderUsername: user.username,
            picVersion: userData.picVersion,
            picId: userData.picId,
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

  /**
   * creates new comment notification
   * @param user logged in user
   * @param receiverId receiver id
   */
  async createCommentNotification(user: User, receiverId: string, postId: string): Promise<string> {
    const userData = await this.usersService.getUserById(user._id);
    const commentNotification = async () => {
      await this.notificationModel.create({
        userId: receiverId,
        senderId: user._id,
        senderUsername: user.username,
        picVersion: userData.picVersion,
        picId: userData.picId,
        postId,
        message: `${user.username} commented on your post`,
        createdAt: new Date(),
      });
    };

    return commentNotification()
        .then(() => {
          return JSON.stringify(receiverId);
        })
        .catch((err) => {
          throw new InternalServerErrorException({ message: 'Unable to send comment notification' });
        });
  }

  /**
   * creates new like notification
   * @param user logged in user
   * @param receiverId receiver id
   */
  async createLikeNotification(user: User, receiverId: string, postId: string): Promise<string> {
    const userData = await this.usersService.getUserById(user._id);
    const LikeNotification = async () => {
      await this.notificationModel.create({
        userId: receiverId,
        senderId: user._id,
        senderUsername: user.username,
        picVersion: userData.picVersion,
        picId: userData.picId,
        postId,
        message: `${user.username} liked your post`,
        createdAt: new Date(),
      });
    };

    return LikeNotification()
        .then(() => {
          return JSON.stringify(receiverId);
        })
        .catch((err) => {
          throw new InternalServerErrorException({ message: 'Unable to send like notification' });
        });
  }
}
