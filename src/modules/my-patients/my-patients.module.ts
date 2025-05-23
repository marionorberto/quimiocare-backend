import { Module } from '@nestjs/common';
import { MyPatientsService } from './my-patients.service';
import { MyPatientsController } from './my-patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { Profile } from 'src/database/entities/profiles/user-profile.entity';
import { ProfileDoctor } from 'src/database/entities/profiles-doctor/user-profile-doctor.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Medication, User, Profile, ProfileDoctor]),
  ],
  controllers: [MyPatientsController],
  providers: [MyPatientsService, UsersService],
  exports: [MyPatientsService, UsersService],
})
export class MyPatientsModule {}
