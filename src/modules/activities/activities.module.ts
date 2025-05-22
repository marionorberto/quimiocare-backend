import { Module } from '@nestjs/common';
import { ActivityService } from './activities.service';
import { ativitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/database/entities/appointment/appointment.entity';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from '../users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User])],
  controllers: [ativitiesController],
  providers: [ActivityService, UsersService],
  exports: [ActivityService, UsersService],
})
export class ActivityModule {}
