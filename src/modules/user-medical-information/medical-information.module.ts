import { Module } from '@nestjs/common';
import { MedicalInformationService } from './medical-information.service';
import { MedicalInformationController } from './medical-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from '../users/users.service';
import { MedicalInformation } from 'src/database/entities/user-medical-information/medical-information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalInformation, User])],
  controllers: [MedicalInformationController],
  providers: [MedicalInformationService, UsersService],
  exports: [MedicalInformationService, UsersService],
})
export class MedicalInformationModule {}
