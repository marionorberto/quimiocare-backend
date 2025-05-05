import { Module } from '@nestjs/common';
import { DailysService } from './daily.service';
import { DailysController } from './daily.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from '../users/users.service';
import { Daily } from 'src/database/entities/daily/daily.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Daily, User])],
  controllers: [DailysController],
  providers: [DailysService, UsersService],
  exports: [DailysService, UsersService],
})
export class DailyModule {}
