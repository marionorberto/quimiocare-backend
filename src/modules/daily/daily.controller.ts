import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DailysService } from './daily.service';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { CreateDailyDto } from './dtos/create-daily.dto';
import { UpdateDailyDto } from './dtos/update-daily.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('dailys')
export class DailysController {
  constructor(private dailyService: DailysService) {}
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.dailyService.findAll(request);
  }

  @Get('daily/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.dailyService.findByPk(id);
  }

  @Post('create/daily')
  async create(
    @Body() createDailyDto: CreateDailyDto,
    @Req() request: Request,
  ) {
    return await this.dailyService.create(createDailyDto, request);
  }

  @Put('update/daily/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updatedailyDto: UpdateDailyDto,
  ) {
    return await this.dailyService.updateOne(id, updatedailyDto);
  }

  @Delete('delete/daily/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.dailyService.deleteOne(id);
  }

  @Get('already')
  async already(@Req() request: Request) {
    return await this.dailyService.already(request);
  }
}
