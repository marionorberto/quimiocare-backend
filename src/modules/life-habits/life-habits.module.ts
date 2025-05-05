import { Module } from '@nestjs/common';
import { UserLifeHabitsService } from './life-habits.service';
import { UserLifeHabitsController } from './life-habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLifeHabits } from 'src/database/entities/life-habits/life-habits.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UserLifeHabits])],
  controllers: [UserLifeHabitsController],
  providers: [UserLifeHabitsService],
  exports: [UserLifeHabitsService],
})
export class TipsModule {}
