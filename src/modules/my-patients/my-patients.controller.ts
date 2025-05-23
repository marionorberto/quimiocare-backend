import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  // Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { MyPatientsService } from './my-patients.service';
import { CreateMyPatientsDto } from './dtos/create-my-patients.dto';
// import { UpdateMyPatientsDto } from './dtos/update-my-patients.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('my-patients')
export class MyPatientsController {
  constructor(private readonly myPatientsService: MyPatientsService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.myPatientsService.findAll(request);
  }

  @Get('my-patients/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.myPatientsService.findByPk(id);
  }

  @Post('create/my-patient')
  create(@Body() createMedicationDto: CreateMyPatientsDto) {
    return this.myPatientsService.create(createMedicationDto);
  }

  @Delete('delete/my-patients/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.myPatientsService.deleteOne(id);
  }

  @Get('last')
  async last(@Req() request: Request) {
    return await this.myPatientsService.last(request);
  }

  @Get('doctor/patients')
  findAllPatientsFromDoctor(@Req() request: Request) {
    return this.myPatientsService.findAllPatientsFromDoctor(request);
  }

  @Get('patient/doctors')
  findDoctorFromPatient(@Req() request: Request) {
    return this.myPatientsService.findDoctorFromPatient(request);
  }
}
