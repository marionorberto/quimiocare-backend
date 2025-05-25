import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { User } from 'src/database/entities/users/user.entity';
import { Request } from 'express';
import { Alerts } from 'src/database/entities/alerts/alert.entity';

@Injectable()
export class alertsService {
  constructor(
    @InjectRepository(Alerts)
    private readonly alertsRepository: Repository<Alerts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      // const userData = await this.userRepository.findOneBy({
      //   id: idUserFromRequest,
      // });

      // const { data }: { data: User } = await this.userServices.findByPk(userId);
      const allAlerts = await this.alertsRepository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: idUserFromRequest,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Notifications fetched sucessfully.',
        data: [{ count: allAlerts.length }, allAlerts],
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

  async myAlerts(request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];
      const allAlerts = await this.alertsRepository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: idUserFromRequest,
          },
          dismiss: false,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      console.log('meus alertas', allAlerts);

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Alertas buscado com sucesso!',
        data: [
          {
            count: allAlerts.length,
          },
          allAlerts,
        ],
        path: '/alerts/alert/myAlerts',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`alerts | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: error.message,
          path: '/alerts/alert',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async findByPk(idNotification: string) {
  //   try {
  //     const notification = await this.notificationsRepository.findOne({
  //       where: {
  //         id: idNotification,
  //       },
  //     });

  //     if (!notification)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'Failure to fetch this notification.',
  //           path: '/notifications',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     return {
  //       statusCode: 200,
  //       method: 'GET',
  //       message: 'Notification fetched sucessfully.',
  //       data: {
  //         notification,
  //       },
  //       path: '/notifications/notification/:idNotification',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to fetch this notification. | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 404,
  //         method: 'GET',
  //         message: 'Failed to fetch this notification.',
  //         error: error.message,
  //         path: '/notifications',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  async create(createAlertDto: CreateAlertDto) {
    try {
      const userData = await this.userRepository.findOneBy({
        id: createAlertDto.user,
      });

      console.log('kennyyyy', createAlertDto);

      const alertToSave = this.alertsRepository.create({
        ...createAlertDto,
        user: userData,
      });

      const { id, title, content, sender, status, user, createdAt } =
        await this.alertsRepository.save(alertToSave);
      return {
        statusCode: 201,
        method: 'POST',
        message: 'Alerts created sucessfully',
        data: {
          id,
          title,
          content,
          sender,
          status,
          user,
          createdAt,
        },
        path: '/alerts',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new alerts | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: error.message,
          error: error.message,
          path: '/alerts',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async dismiss(id: string) {
    try {
      console.log('oieee', id);
      const dismissAlert = this.alertsRepository.update(id, {
        dismiss: true,
      });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Excluido com sucesso!',
        data: {
          dismissed: true,
          dismissAlert,
        },
        path: '/alerts/dismiss',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to dismiss| Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Não foi possível apagar a notificação, tente mais tarde!',
          error: error.message,
          path: '/alerts/update',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async updateOne(
  //   idNotification: string,
  //   updateNotificationsDto: Partial<UpdateNotificationsDto>,
  // ) {
  //   try {
  //     await this.notificationsRepository.update(
  //       idNotification,
  //       updateNotificationsDto,
  //     );

  //     const {
  //       user,
  //       title,
  //       subtitle,
  //       content,
  //       linkAction,
  //       read,
  //       readAt,
  //       createdAt,
  //       updatedAt,
  //     } = await this.notificationsRepository.findOneBy({ id: idNotification });

  //     return {
  //       statusCode: 200,
  //       method: 'PUT',
  //       message: 'Notification updated sucessfully',
  //       data: {
  //         id: idNotification,
  //         user,
  //         title,
  //         subtitle,
  //         content,
  //         linkAction,
  //         read,
  //         readAt,
  //         createdAt,
  //         updatedAt,
  //       },
  //       path: 'update/notification/:idNotification',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to update new Notification | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to update Notification',
  //         error: error.message,
  //         path: 'update/notification/:idNotification',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async deleteOne(idNotification: string) {
  //   try {
  //     const notificationToDelete = await this.notificationsRepository.findOneBy(
  //       {
  //         id: idNotification,
  //       },
  //     );

  //     if (!notificationToDelete)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'Notifications Not Found',
  //           path: '/notifications/:idNotification',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     await this.notificationsRepository.remove(notificationToDelete);

  //     return {
  //       statusCode: 200,
  //       method: 'DELETE',
  //       message: 'Notification deleted sucessfully',
  //       path: '/notifications',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to delete Notification | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to delete Notification',
  //         error: error.message,
  //         path: '/notifications',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
