import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Medication, User])],
  controllers: [QuestionController],
  providers: [QuestionService, UsersService],
  exports: [QuestionService, UsersService],
})
export class QuestionModule {}
