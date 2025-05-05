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
} from '@nestjs/common';
import { UserLifeHabitsService } from './life-habits.service';
import { CreateUserLifeHabitsDto } from './dtos/create-life-habits.dto';
import { UpdateUserLifeHabitsDto } from './dtos/update-life-habits.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tips')
export class UserLifeHabitsController {
  constructor(private readonly userLifeHabitsServices: UserLifeHabitsService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.userLifeHabitsServices.findAll();
  }

  @Get('life-habits/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.userLifeHabitsServices.findByPk(id);
  }

  @Post('create/life-habits')
  create(@Body() createUserLifeHabitsDto: CreateUserLifeHabitsDto) {
    return this.userLifeHabitsServices.create(createUserLifeHabitsDto);
  }

  @Put('update/life-habits/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserLifeHabitsDto: UpdateUserLifeHabitsDto,
  ) {
    return await this.userLifeHabitsServices.updateOne(
      id,
      updateUserLifeHabitsDto,
    );
  }

  @Delete('delete/tips-category/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.userLifeHabitsServices.deleteOne(id);
  }
}
