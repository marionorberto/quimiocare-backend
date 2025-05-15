import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/database/entities/posts/posts.entity';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { Tags } from 'src/database/entities/tags/tags.entity';
import { TagsService } from 'src/modules/tags/tags.service';
import { Followers } from 'src/database/entities/followers/followers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Tags, Followers])],
  providers: [PostsService, UsersService, TagsService],
  controllers: [PostsController],
  exports: [PostsService, UsersService, TagsService],
})
export class PostsModule {}
