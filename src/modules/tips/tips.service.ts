import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTipsDto } from './dtos/create-tips.dto';
import { UpdateTipsDto } from './dtos/update-tips.dto';

import { DataSource, Repository } from 'typeorm';
import { Tips } from 'src/database/entities/tips/tips.entity';
import { TipsCategory } from 'src/database/entities/tips_category/tips_category.entity';
import { TipsCategoryService } from '../tips-category/tips-category.service';
import { Request } from 'express';
import { User } from 'src/database/entities/users/user.entity';
@Injectable()
export class TipsService {
  private tipsRepository: Repository<Tips>;
  private userRepo: Repository<User>;
  private tipsCategoryRepository: Repository<TipsCategory>;
  constructor(
    private readonly datasource: DataSource,
    private tipsCategoryService: TipsCategoryService,
  ) {
    this.tipsRepository = this.datasource.getRepository(Tips);
    this.tipsCategoryRepository = this.datasource.getRepository(TipsCategory);
  }

  async findAll() {
    try {
      const alltips = await this.tipsRepository.find({
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

  async myTips(request: Request) {
    try {
      const { idUser } = request['user'];

      const alltips = await this.tipsRepository.find({
        where: {
          userDoctor: {
            id: idUser,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'My tips  fetched sucessfully.',
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

  async findByPk() {
    try {
      const allTips = await this.tipsRepository.find({
        order: {
          createdAt: 'DESC',
        },
        relations: {
          category: true,
        },
      });

      if (!allTips)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this tips.',
            path: '/tips/all/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'tips fetched sucessfully.',
        data: allTips[Math.floor(Math.random() * allTips.length)],
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

  async create(request: Request, createTipsDto: CreateTipsDto) {
    try {
      const { idUser } = request['user'];

      const user = await this.userRepo.findOneBy({ id: idUser });

      const { data: categoryGot } = await this.tipsCategoryService.findByPk(
        createTipsDto.category,
      );

      if (!categoryGot) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this category.',
            path: '/tipsCategory/category/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const tipsToSave = this.tipsRepository.create({
        description: createTipsDto.description,
        userDoctor: user,
        category: categoryGot,
      });

      const tipsSaved = await this.tipsRepository.save(tipsToSave);

      const { id, description, category, userDoctor, createdAt } = tipsSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'tips created sucessfully',
        data: { id, description, category, userDoctor, createdAt },
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

  async updateOne(id: string, updateTipsDto: Partial<UpdateTipsDto>) {
    const idToUpdate = id;
    try {
      await this.tipsRepository.update(idToUpdate, updateTipsDto);

      const { id, description, category, createdAt, updatedAt } =
        await this.tipsRepository.findOneBy({ id: idToUpdate });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Tip updated sucessfully',
        data: {
          id,
          description,
          category,
          createdAt,
          updatedAt,
        },
        path: '/tips/update/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Tips | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Tips',
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
      const tipsToDelete = await this.tipsRepository.findOneBy({
        id,
      });
      if (!tipsToDelete)
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

      await this.tipsRepository.remove(tipsToDelete);

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
