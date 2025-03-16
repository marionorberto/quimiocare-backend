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
import { SymptomsService } from './symptoms.service';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { CreateSymptomDto } from './dtos/create-symptom.dto';
import { UpdateSymptomDto } from './dtos/update-symptom.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('symptoms')
export class SymptomsController {
  constructor(private symptomService: SymptomsService) {}
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.symptomService.findAll(request);
  }

  @Get('symptom/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.symptomService.findByPk(id);
  }

  @Post('create/symptom')
  async create(
    @Body() createSymptomDto: CreateSymptomDto,
    @Req() request: Request,
  ) {
    return await this.symptomService.create(createSymptomDto, request);
  }

  @Put('update/symptom/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateSymptomDto: UpdateSymptomDto,
  ) {
    return await this.symptomService.updateOne(id, updateSymptomDto);
  }

  @Delete('delete/symptom/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.symptomService.deleteOne(id);
  }
}
