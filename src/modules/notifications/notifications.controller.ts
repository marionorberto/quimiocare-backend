import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationsDto } from './dtos/create-notifications.dto';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsServices: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.notificationsServices.findAll(request);
  }

  // @Get('notification/:idNotification')
  // async findByPk(@Param('idNotification') idNotification: string) {
  //   return await this.notificationsServices.findByPk(idNotification);
  // }

  @UseGuards(AuthGuard)
  @Post('create/notification')
  create(
    @Req() request: Request,
    @Body() createNotificationsDto: CreateNotificationsDto,
  ) {
    return this.notificationsServices.create(request, createNotificationsDto);
  }

  // @Put('update/notification/:idNotification')
  // async updateOne(
  //   @Param('idNotification') idNotification: string,
  //   @Body() updateNotificationsDto: Partial<UpdateNotificationsDto>,
  // ) {
  //   return await this.notificationsServices.updateOne(
  //     idNotification,
  //     updateNotificationsDto,
  //   );
  // }

  // @Delete('delete/notification/:idNotification')
  // async deleteOne(@Param('idNotification') idNotification: string) {
  //   return await this.notificationsServices.deleteOne(idNotification);
  // }
}
