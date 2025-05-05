import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Profile } from 'src/database/entities/profiles/user-profile.entity';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { UsersModule } from 'src/modules/users/users.module';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { TagsModule } from 'src/modules/tags/tags.module';
import { TagsService } from 'src/modules/tags/tags.service';
import { Tags } from 'src/database/entities/tags/tags.entity';
import { Followers } from 'src/database/entities/followers/followers.entity';
import { ProfileDoctor } from 'src/database/entities/profiles-doctor/user-profile-doctor.entity';

@Module({
  imports: [
    UsersModule,
    TagsModule,
    TypeOrmModule.forFeature([Profile, User, Tags, Followers, ProfileDoctor]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UsersService, TagsService],
  exports: [ProfileService, UsersService, TagsService],
})
export class ProfileModule {}
