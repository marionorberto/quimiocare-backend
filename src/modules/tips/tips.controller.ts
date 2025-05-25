import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipsDto } from './dtos/create-tips.dto';
import { UpdateTipsDto } from './dtos/update-tips.dto';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Request } from 'express';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsServices: TipsService) {}

  @Get('all')
  async findAll() {
    return await this.tipsServices.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('my-tips')
  async myTips(@Req() request: Request) {
    return await this.tipsServices.myTips(request);
  }

  @Get('tip')
  async findByPk() {
    return await this.tipsServices.findByPk();
  }

  @UseGuards(AuthGuard)
  @Post('create/tip')
  create(@Req() request: Request, @Body() createUserDto: CreateTipsDto) {
    return this.tipsServices.create(request, createUserDto);
  }

  @Put('update/tip/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateTipDto: UpdateTipsDto,
  ) {
    return await this.tipsServices.updateOne(id, updateTipDto);
  }

  @Delete('delete/tip/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.tipsServices.deleteOne(id);
  }

  @Put('active/:id')
  async active(@Param('id') id: string) {
    return await this.tipsServices.active(id);
  }

  @Put('reject/:id')
  async reject(@Param('id') id: string) {
    return await this.tipsServices.reject(id);
  }
}
