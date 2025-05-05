import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profiles.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { CreateProfileDoctorDto } from './dtos/create-profile-doctor.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll() {
    return await this.profileService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('single')
  async findByPk(@Req() request: Request) {
    return await this.profileService.findByPk(request);
  }

  @UseGuards(AuthGuard)
  @Get('single/doctor')
  async findByPkDoctor(@Req() request: Request) {
    return await this.profileService.findByPkDoctor(request);
  }

  @Post('create/profile')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Post('create/profile/doctor')
  createDoctor(@Body() createProfileDoctoDto: CreateProfileDoctorDto) {
    return this.profileService.createDoctor(createProfileDoctoDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/profile')
  async updateOne(
    @Req() request: Request,
    @Body() updateProfileDto: Partial<UpdateProfileDto>,
  ) {
    return this.profileService.updateOne(request, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/profile/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.profileService.deleteOne(id);
  }
}
