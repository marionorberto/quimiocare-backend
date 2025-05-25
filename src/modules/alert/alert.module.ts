import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Alerts } from 'src/database/entities/alerts/alert.entity';
import { alertsService } from './alert.service';
import { AlertsController } from './alert.controller';
import { User } from 'src/database/entities/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Alerts])],
  providers: [alertsService, UsersService],
  controllers: [AlertsController],
  exports: [alertsService, UsersService],
})
export class AlertsModule {}
