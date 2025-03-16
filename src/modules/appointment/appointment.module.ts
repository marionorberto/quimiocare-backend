import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { AppointmentController } from './appoitment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/database/entities/appointment/appointment.entity';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from '../users/users.service';
@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User])],
  controllers: [AppointmentController],
  providers: [AppointmentsService, UsersService],
  exports: [AppointmentsService, UsersService],
})
export class AppointmentModule {}
