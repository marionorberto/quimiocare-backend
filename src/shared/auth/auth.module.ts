import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from './constants';
import { UsersModule } from 'src/modules/users/users.module';
import { EmailModule } from 'src/modules/email/email.module';
import { EmailService } from 'src/modules/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, //This means that we don't need to import the JwtModule anywhere else in our application
      secret: jwtContants.secret,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, UsersService],
  exports: [AuthService, EmailService, UsersService],
})
export class AuthModule {}
