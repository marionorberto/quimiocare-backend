import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserLifeHabitsDto } from './dtos/create-life-habits.dto';
import { UpdateUserLifeHabitsDto } from './dtos/update-life-habits.dto';

import { DataSource, Repository } from 'typeorm';
import { UserLifeHabits } from 'src/database/entities/life-habits/life-habits.entity';
@Injectable()
export class UserLifeHabitsService {
  private userLifeHabitsRepository: Repository<UserLifeHabits>;
  constructor(private readonly datasource: DataSource) {
    this.userLifeHabitsRepository =
      this.datasource.getRepository(UserLifeHabits);
  }

  async findAll() {
    try {
      const alltips = await this.userLifeHabitsRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Tips fetched sucessfully.',
        data: [{ count: alltips.length }, alltips],
        path: '/Tips/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch Tips | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch Tips.',
          path: '/Tips/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const tips = await this.userLifeHabitsRepository.findOneBy({ id });

      if (!tips)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this tiptips.',
            path: '/tiptips/tips/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'tips fetched sucessfully.',
        data: tips,
        path: '/tips/tips/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Tips. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this user.',
          error: error.message,
          path: '/tips/tips/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createUserLifeHabitsDto: CreateUserLifeHabitsDto) {
    try {
      const tipsToSave = this.userLifeHabitsRepository.create(
        createUserLifeHabitsDto,
      );

      const tipsSaved = await this.userLifeHabitsRepository.save(tipsToSave);

      const { id, description, createdAt } = tipsSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'tips created sucessfully',
        data: { id, description, createdAt },
        path: '/tips/create/user',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new tips | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new tips',
          error: error.message,
          path: '/tips/create/tips',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updateUserLifeHabitsDto: Partial<UpdateUserLifeHabitsDto>,
  ) {
    try {
      await this.userLifeHabitsRepository.update(id, updateUserLifeHabitsDto);

      const { createdAt, updatedAt } =
        await this.userLifeHabitsRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          createdAt,
          updatedAt,
        },
        path: '/tips/update/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update User',
          error: error.message,
          path: '/tips/update/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const lifeHabitToDelete = await this.userLifeHabitsRepository.findOneBy({
        id,
      });
      if (!lifeHabitToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found',
            path: '/tips/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.userLifeHabitsRepository.remove(lifeHabitToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'tiptips deleted sucessfully',
        path: '/tips/delete/tips/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete tiptips | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Tiptips',
          error: error.message,
          path: '/Tips/delete/tips/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
