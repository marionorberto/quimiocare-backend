import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TagsModule } from './modules/tags/tags.module';
import { ProfileModule } from './modules/profiles/profiles.module';
import { AuthModule } from './shared/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { TypeOrmModule } from './config/datasource';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { ConfigModule } from '@nestjs/config';

import { EmailModule } from './modules/email/email.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SymptomsModule } from './modules/symptoms/symptoms.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 25,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 50,
      },
    ]),
    TypeOrmModule,
    UsersModule,
    AuthModule,
    PostsModule,
    TagsModule,
    ProfileModule,
    FeedbackModule,
    NotificationsModule,
    FileUploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    SymptomsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private readonly datasource: DataSource) {}
}
