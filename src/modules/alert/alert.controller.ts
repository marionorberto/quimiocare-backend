import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { alertsService } from './alert.service';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Request } from 'express';

@Controller('alerts')
export class AlertsController {
  constructor(private alertsServices: alertsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.alertsServices.findAll(request);
  }

  // @Get('alert/:idalert')
  // async findByPk(@Param('idalert') idalert: string) {
  //   return await this.alertsServices.findByPk(idalert);
  // }

  @UseGuards(AuthGuard)
  @Get('myAlerts')
  async myAlerts(@Req() request: Request) {
    return await this.alertsServices.myAlerts(request);
  }

  @Post('create/alert')
  create(@Body() CreateAlertDto: CreateAlertDto) {
    return this.alertsServices.create(CreateAlertDto);
  }

  // @Put('update/alert/:idalert')
  // async updateOne(
  //   @Param('idalert') idalert: string,
  //   @Body() updatealertsDto: Partial<UpdatealertsDto>,
  // ) {
  //   return await this.alertsServices.updateOne(
  //     idalert,
  //     updatealertsDto,
  //   );
  // }

  // @Delete('delete/alert/:idalert')
  // async deleteOne(@Param('idalert') idalert: string) {
  //   return await this.alertsServices.deleteOne(idalert);
  // }

  @Get('dismiss/:id')
  async dismiss(@Param('id') id: string) {
    return await this.alertsServices.dismiss(id);
  }
}
