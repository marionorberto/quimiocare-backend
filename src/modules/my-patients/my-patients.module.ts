import { Module } from '@nestjs/common';
import { MyPatientsService } from './my-patients.service';
import { MyPatientsController } from './my-patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Medication, User])],
  controllers: [MyPatientsController],
  providers: [MyPatientsService, UsersService],
  exports: [MyPatientsService, UsersService],
})
export class MyPatientsModule {}
