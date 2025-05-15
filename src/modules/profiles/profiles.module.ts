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
import { suggestVideo } from 'src/database/entities/suggest/suggest.entity';
import { Daily } from 'src/database/entities/daily/daily.entity';
import { Medication } from 'src/database/entities/medications/medication.entity';
import { Symptom } from 'src/database/entities/symptoms/symptom.entity';
import { Appointment } from 'src/database/entities/appointment/appointment.entity';

@Module({
  imports: [
    UsersModule,
    TagsModule,
    TypeOrmModule.forFeature([
      Profile,
      User,
      Tags,
      Followers,
      ProfileDoctor,
      suggestVideo,
      Daily,
      Medication,
      Symptom,
      Appointment,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UsersService, TagsService],
  exports: [ProfileService, UsersService, TagsService],
})
export class ProfileModule {}
