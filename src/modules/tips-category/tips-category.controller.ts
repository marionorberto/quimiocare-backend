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
import { TipsCategoryService } from './tips-category.service';
import { CreateTipsCategoryDto } from './dtos/create-tips-category.dto';
import { UpdateTipsCategoryDto } from './dtos/update-tips-category.dto';

@Controller('tips-category')
export class TipsCategoryController {
  constructor(private readonly tipsCategorysServices: TipsCategoryService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.tipsCategorysServices.findAll();
  }

  @Get('tips-category/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.tipsCategorysServices.findByPk(id);
  }

  @Post('create/category')
  create(@Body() createTipsCategoryDto: CreateTipsCategoryDto) {
    return this.tipsCategorysServices.create(createTipsCategoryDto);
  }

  @Put('update/tips-category/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateTipsCategoryDto: UpdateTipsCategoryDto,
  ) {
    return await this.tipsCategorysServices.updateOne(
      id,
      updateTipsCategoryDto,
    );
  }

  @Delete('delete/tips-category/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.tipsCategorysServices.deleteOne(id);
  }
}
