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
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './dtos/create-medication.dto';
import { UpdateMedicationDto } from './dtos/update-medication.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.medicationService.findAll(request);
  }

  @Get('medication/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.medicationService.findByPk(id);
  }

  @Post('create/medication')
  create(
    @Body() createMedicationDto: CreateMedicationDto,
    @Req() request: Request,
  ) {
    return this.medicationService.create(createMedicationDto, request);
  }

  @Put('update/medication/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return await this.medicationService.updateOne(id, updateMedicationDto);
  }

  @Delete('delete/medication/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.medicationService.deleteOne(id);
  }

  @Get('last')
  async last(@Req() request: Request) {
    return await this.medicationService.last(request);
  }
}
