import { Module } from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { SymptomsController } from './symptoms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symptom } from 'src/database/entities/symptoms/symptom.entity';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Symptom, User])],
  controllers: [SymptomsController],
  providers: [SymptomsService, UsersService],
  exports: [SymptomsService, UsersService],
})
export class SymptomsModule {}
