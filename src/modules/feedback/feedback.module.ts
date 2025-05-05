import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { User } from 'src/database/entities/users/user.entity';
import { UserFeedback } from 'src/database/entities/user-feedback/user-feedback.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFeedback, User])],
  controllers: [FeedbackController],
  providers: [FeedbackService, UsersService],
  exports: [FeedbackService, UsersService],
})
export class FeedbackModule {}
