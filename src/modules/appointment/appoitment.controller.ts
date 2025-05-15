import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentServices: AppointmentsService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.appointmentServices.findAll(request);
  }

  @Get('appointment/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.appointmentServices.findByPk(id);
  }

  @Post('create/appointment')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request: Request,
  ) {
    return this.appointmentServices.create(createAppointmentDto, request);
  }

  @Put('update/appointment/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUsersDto: UpdateAppointmentDto,
  ) {
    return await this.appointmentServices.updateOne(id, updateUsersDto);
  }

  @Delete('delete/appointment/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.appointmentServices.deleteOne(id);
  }

  @Get('last')
  async last(@Req() request: Request) {
    return await this.appointmentServices.last(request);
  }
}
