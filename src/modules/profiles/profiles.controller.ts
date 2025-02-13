import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profiles.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('all')
  async fillAll() {
    return await this.profileService.findAll();
  }

  @Get('profile/:id')
  async findByPk(@Param('id') id: string) {
    return await this.profileService.findByPk(id);
  }

  @Post('create/profile')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Put('update/profile/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateProfileDto: Partial<UpdateProfileDto>,
  ) {
    return this.profileService.updateOne(id, updateProfileDto);
  }

  @Delete('delete/profile/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.profileService.deleteOne(id);
  }
}
