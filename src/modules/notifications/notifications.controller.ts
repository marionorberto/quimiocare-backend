import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Put,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationsDto } from './dtos/create-notifications.dto';
import { UpdateNotificationsDto } from './dtos/update-notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsServices: NotificationsService) {}

  @Get('all/:userId')
  async findAll(@Param('userId') userId: string) {
    return await this.notificationsServices.findAll(userId);
  }

  @Get('notification/:idNotification')
  async findByPk(@Param('idNotification') idNotification: string) {
    return await this.notificationsServices.findByPk(idNotification);
  }

  @Post('create/notification')
  create(@Body() createNotificationsDto: CreateNotificationsDto) {
    return this.notificationsServices.create(createNotificationsDto);
  }

  @Put('update/notification/:idNotification')
  async updateOne(
    @Param('idNotification') idNotification: string,
    @Body() updateNotificationsDto: Partial<UpdateNotificationsDto>,
  ) {
    return await this.notificationsServices.updateOne(
      idNotification,
      updateNotificationsDto,
    );
  }

  @Delete('delete/notification/:idNotification')
  async deleteOne(@Param('idNotification') idNotification: string) {
    return await this.notificationsServices.deleteOne(idNotification);
  }
}
