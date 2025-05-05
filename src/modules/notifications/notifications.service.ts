import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notifications } from 'src/database/entities/notifications/notifications.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateNotificationsDto } from './dtos/create-notifications.dto';
import { UpdateNotificationsDto } from './dtos/update-notifications.dto';
import { UsersService } from 'src/modules/users/users.service';
// import { User } from 'src/entities/users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
    private readonly userServices: UsersService,
  ) {}

  async findAll(userId: string) {
    try {
      // const { data }: { data: User } = await this.userServices.findByPk(userId);
      console.log(userId);
      const allUserNotifications = await this.notificationsRepository.find({
        relations: {
          user: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Notifications fetched sucessfully.',
        data: [{ count: allUserNotifications.length }, allUserNotifications],
        path: '/notifications/notification/:userId',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch notifications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch notifications.',
          path: '/notifications/notification/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(idNotification: string) {
    try {
      const notification = await this.notificationsRepository.findOne({
        where: {
          id: idNotification,
        },
      });

      if (!notification)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this notification.',
            path: '/notifications',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Notification fetched sucessfully.',
        data: {
          notification,
        },
        path: '/notifications/notification/:idNotification',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this notification. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this notification.',
          error: error.message,
          path: '/notifications',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createNotificationsDto: Partial<CreateNotificationsDto>) {
    console.log(createNotificationsDto);
    try {
      const notificationToSave = this.notificationsRepository.create(
        createNotificationsDto,
      );

      // const { data } = await this.userServices.findByPk(
      //   createNotificationsDto.userId,
      // );

      // if (!data)
      //   throw new HttpException(
      //     {
      //       statusCode: 400,
      //       method: 'POST',
      //       message: 'Failed to create new Notification',
      //       path: '/notifications',
      //       timestamp: Date.now(),
      //     },
      //     HttpStatus.NOT_FOUND,
      //   );

      const {
        id,
        user,
        title,
        subtitle,
        content,
        read,
        readAt,
        linkAction,
        createdAt,
      } = await this.notificationsRepository.save({
        ...notificationToSave,
        // user: data,
      });
      return {
        statusCode: 201,
        method: 'POST',
        message: 'Notifications created sucessfully',
        data: {
          id,
          user,
          title,
          subtitle,
          content,
          read,
          readAt,
          linkAction,
          createdAt,
        },
        path: '/notifications',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Notification | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Notification',
          error: error.message,
          path: '/notifications',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    idNotification: string,
    updateNotificationsDto: Partial<UpdateNotificationsDto>,
  ) {
    try {
      await this.notificationsRepository.update(
        idNotification,
        updateNotificationsDto,
      );

      const {
        user,
        title,
        subtitle,
        content,
        linkAction,
        read,
        readAt,
        createdAt,
        updatedAt,
      } = await this.notificationsRepository.findOneBy({ id: idNotification });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Notification updated sucessfully',
        data: {
          id: idNotification,
          user,
          title,
          subtitle,
          content,
          linkAction,
          read,
          readAt,
          createdAt,
          updatedAt,
        },
        path: 'update/notification/:idNotification',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Notification | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Notification',
          error: error.message,
          path: 'update/notification/:idNotification',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(idNotification: string) {
    try {
      const notificationToDelete = await this.notificationsRepository.findOneBy(
        {
          id: idNotification,
        },
      );

      if (!notificationToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Notifications Not Found',
            path: '/notifications/:idNotification',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.notificationsRepository.remove(notificationToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Notification deleted sucessfully',
        path: '/notifications',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete Notification | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to delete Notification',
          error: error.message,
          path: '/notifications',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
