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
import { CancertypesService } from './cancer-types.service';
import { CreateCancerTypesDto } from './dtos/create-cancer-types.dto';
import { UpdateCancerTypesDto } from './dtos/update-cancer-types.dto';

@Controller('cancer-types')
export class CancertypesController {
  constructor(private readonly cancertypesServices: CancertypesService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.cancertypesServices.findAll();
  }

  @Get('cancer-types/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.cancertypesServices.findByPk(id);
  }

  @Post('create/types')
  create(@Body() createCancerTypesDto: CreateCancerTypesDto) {
    return this.cancertypesServices.create(createCancerTypesDto);
  }

  @Put('update/cancer-types/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateCancertypesDto: UpdateCancerTypesDto,
  ) {
    return await this.cancertypesServices.updateOne(id, updateCancertypesDto);
  }

  @Delete('delete/cancer-types/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.cancertypesServices.deleteOne(id);
  }
}
