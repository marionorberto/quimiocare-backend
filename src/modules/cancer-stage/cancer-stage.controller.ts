import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CancerStageService } from './cancer-stage.service';
import { CreateCancerStageDto } from './dtos/create-cancer-stage.dto';
import { UpdateCancerStageDto } from './dtos/update-cancer-stage.dto';

@Controller('cancer-stages')
export class CancerStageController {
  constructor(private readonly cancerStageServices: CancerStageService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.cancerStageServices.findAll();
  }

  @Get('cancer-stage/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.cancerStageServices.findByPk(id);
  }

  @Post('create/stage')
  create(@Body() createCancerStageDto: CreateCancerStageDto) {
    return this.cancerStageServices.create(createCancerStageDto);
  }

  @Put('update/cancer-stage/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateCancerStageDto: UpdateCancerStageDto,
  ) {
    return await this.cancerStageServices.updateOne(id, updateCancerStageDto);
  }

  @Delete('delete/cancer-stage/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.cancerStageServices.deleteOne(id);
  }
}
