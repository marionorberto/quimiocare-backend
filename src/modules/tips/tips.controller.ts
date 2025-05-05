import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipsDto } from './dtos/create-tips.dto';
import { UpdateTipsDto } from './dtos/update-tips.dto';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsServices: TipsService) {}

  @Get('all')
  async findAll() {
    return await this.tipsServices.findAll();
  }

  @Get('tip')
  async findByPk() {
    return await this.tipsServices.findByPk();
  }

  @Post('create/tip')
  create(@Body() createUserDto: CreateTipsDto) {
    return this.tipsServices.create(createUserDto);
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
}
