import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
  ExecutionContext,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Repository } from 'typeorm';
import { CreateDailyDto } from './dtos/create-daily.dto';
import { Request } from 'express';
import { UpdateDailyDto } from './dtos/update-daily.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { Daily } from 'src/database/entities/daily/daily.entity';
@UseGuards(AuthGuard)
@Injectable()
export class DailysService {
  private context: ExecutionContext;
  constructor(
    @InjectRepository(Daily)
    private readonly dailyRepository: Repository<Daily>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userServices: UsersService,
  ) {}
  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const alldaily = await this.dailyRepository
        .createQueryBuilder('daily')
        .where('daily.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'all dailys fetched sucessfully.',
        data: [{ count: alldaily.length }, alldaily],
        path: '/dailys/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch daily | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch daily.',
          path: '/dailys/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createdailyDto: CreateDailyDto, request: Request) {
    console.log(createdailyDto);
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const dailyToSave = this.dailyRepository.create({
        ...createdailyDto,
        user: userData,
      });

      const dailysaved = await this.dailyRepository.save(dailyToSave);

      const {
        id,
        collateralEffect,
        emoccioanlState,
        exercicesToday,
        feedToday,
        hidratedToday,
        note,
        painLevel,
        sleepWell,
        tiredLevelToday,
        createdAt,
      } = dailysaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'daily created sucessfully',
        data: {
          id,
          collateralEffect,
          emoccioanlState,
          exercicesToday,
          feedToday,
          hidratedToday,
          note,
          painLevel,
          sleepWell,
          tiredLevelToday,
          createdAt,
        },
        path: '/dailys/create/daily',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new daily | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new daily',
          error: error.message,
          path: '/dailys/create/daily',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const daily = await this.dailyRepository.findOneBy({ id });

      if (!daily)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this daily.',
            path: '/dailys/daily/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'daily fetched sucessfully.',
        data: daily,
        path: '/dailys/daily/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this daily. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this daily.',
          error: error.message,
          path: '/dailys/daily/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(id: string, updatedailyDto: Partial<UpdateDailyDto>) {
    try {
      await this.dailyRepository.update(id, updatedailyDto);

      const {
        collateralEffect,
        emoccioanlState,
        exercicesToday,
        feedToday,
        hidratedToday,
        painLevel,
        sleepWell,
        tiredLevelToday,
        note,
        createdAt,
        updatedAt,
      } = await this.dailyRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'daily updated sucessfully',
        data: {
          id,
          collateralEffect,
          emoccioanlState,
          exercicesToday,
          feedToday,
          hidratedToday,
          painLevel,
          sleepWell,
          tiredLevelToday,
          note,
          createdAt,
          updatedAt,
        },
        path: '/dailys/update/daily/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new daily | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update daily',
          error: error.message,
          path: '/dailys/update/daily/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const dailyToDelete = await this.dailyRepository.findOneBy({ id });
      if (!dailyToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'daily Not Found',
            path: '/dailys/daily/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.dailyRepository.remove(dailyToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'daily deleted sucessfully',
        path: '/dailys/delete/daily/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete daily | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete daily',
          error: error.message,
          path: '/dailys/delete/daily/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
