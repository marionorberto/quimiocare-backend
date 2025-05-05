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
import { MedicalInformationService } from './medical-information.service';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { CreateMedicalInformationDto } from './dtos/create-medication-information.dto';
import { UpdateMedicalInformationDto } from './dtos/update-medication-information.dto';
import { Request } from 'express';

@Controller('medical-informations')
export class MedicalInformationController {
  constructor(private medicalnformationService: MedicalInformationService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.medicalnformationService.findAll(request);
  }

  @UseGuards(AuthGuard)
  @Get('information')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Req() request: Request) {
    return await this.medicalnformationService.findByPk(request);
  }

  @Post('create/information')
  async create(
    @Body() createMedicalInformationDto: CreateMedicalInformationDto,
  ) {
    return await this.medicalnformationService.create(
      createMedicalInformationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Put('update/information/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateMedicalInformationDto: UpdateMedicalInformationDto,
  ) {
    return await this.medicalnformationService.updateOne(
      id,
      updateMedicalInformationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('delete/information/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.medicalnformationService.deleteOne(id);
  }
}
