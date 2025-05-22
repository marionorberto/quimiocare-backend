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
import { ActivityService } from './activities.service';
import { CreateActivityDto } from './dtos/create-activities.dto';
import { UpdateActivityDto } from './dtos/update-activities.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('ativities')
export class ativitiesController {
  constructor(private readonly ativitiesServices: ActivityService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.ativitiesServices.findAll(request);
  }

  @Get('ativities/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.ativitiesServices.findByPk(id);
  }

  @Post('create/ativities')
  create(
    @Body() createativitiesDto: CreateActivityDto,
    @Req() request: Request,
  ) {
    return this.ativitiesServices.create(createativitiesDto, request);
  }

  @Put('update/ativities/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUsersDto: UpdateActivityDto,
  ) {
    return await this.ativitiesServices.updateOne(id, updateUsersDto);
  }

  @Delete('delete/ativities/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.ativitiesServices.deleteOne(id);
  }

  @Get('last')
  async last(@Req() request: Request) {
    return await this.ativitiesServices.last(request);
  }

  @Get('count')
  async count() {
    return await this.ativitiesServices.count();
  }
}
