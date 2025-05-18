import { Module } from '@nestjs/common';
import { RepliesService } from './question-reply.service';
import { RepliesController } from './question-reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { QuestionReply } from 'src/database/entities/questions-reply/question-reply.entity';
@Module({
  imports: [TypeOrmModule.forFeature([QuestionReply, User])],
  controllers: [RepliesController],
  providers: [RepliesService, UsersService],
  exports: [RepliesService, UsersService],
})
export class RepliesModule {}
