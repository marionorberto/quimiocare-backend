import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTipsCategoryDto } from './dtos/create-tips-category.dto';
import { UpdateTipsCategoryDto } from './dtos/update-tips-category.dto';

import { DataSource, Repository } from 'typeorm';
import { TipsCategory } from 'src/database/entities/tips_category/tips_category.entity';
@Injectable()
export class TipsCategoryService {
  private tipsCategoryRepository: Repository<TipsCategory>;
  constructor(private readonly datasource: DataSource) {
    this.tipsCategoryRepository = this.datasource.getRepository(TipsCategory);
  }

  async findAll() {
    try {
      const allTipsCategories = await this.tipsCategoryRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'TipsCategory fetched sucessfully.',
        data: [{ count: allTipsCategories.length }, allTipsCategories],
        path: '/TipsCategory/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch TipsCategory | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch TipsCategory.',
          path: '/TipsCategory/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const category = await this.tipsCategoryRepository.findOneBy({ id });

      if (!category)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this tipCategory.',
            path: '/tipCategory/category/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Category fetched sucessfully.',
        data: category,
        path: '/tipsCategory/category/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this TipsCategory. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this user.',
          error: error.message,
          path: '/tipsCategory/category/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createTipsCategoryDto: CreateTipsCategoryDto) {
    try {
      const tipsCategoryToSave = this.tipsCategoryRepository.create(
        createTipsCategoryDto,
      );

      const tipsCategorySaved =
        await this.tipsCategoryRepository.save(tipsCategoryToSave);

      const { id, description, createdAt } = tipsCategorySaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'category created sucessfully',
        data: { id, description, createdAt },
        path: '/TipsCategories/create/user',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Category | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Category',
          error: error.message,
          path: '/tipsCategory/create/category',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updateTipsCategoryDto: Partial<UpdateTipsCategoryDto>,
  ) {
    try {
      await this.tipsCategoryRepository.update(id, updateTipsCategoryDto);

      const { createdAt, updatedAt } =
        await this.tipsCategoryRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          createdAt,
          updatedAt,
        },
        path: '/TipsCategories/update/user/:id',
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
          path: '/TipsCategories/update/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const categoryToDelete = await this.tipsCategoryRepository.findOneBy({
        id,
      });
      if (!categoryToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found',
            path: '/TipsCategories/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.tipsCategoryRepository.remove(categoryToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'tipCategory deleted sucessfully',
        path: '/tipsCategory/delete/category/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete tipCategory | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete TipCategory',
          error: error.message,
          path: '/TipsCategory/delete/category/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
