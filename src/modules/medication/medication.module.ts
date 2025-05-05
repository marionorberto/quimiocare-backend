import { Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Medication, User])],
  controllers: [MedicationController],
  providers: [MedicationService, UsersService],
  exports: [MedicationService, UsersService],
})
export class MedicationModule {}
