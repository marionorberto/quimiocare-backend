import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCancerTypesDto } from './dtos/create-cancer-types.dto';
import { UpdateCancerTypesDto } from './dtos/update-cancer-types.dto';

import { DataSource, Repository } from 'typeorm';
import { TipsCategoryService } from '../tips-category/tips-category.service';
import { CancerType } from 'src/database/entities/cancer-types/cancer-types.entity';
@Injectable()
export class CancertypesService {
  private cancertypesRepository: Repository<CancerType>;
  constructor(
    private readonly datasource: DataSource,
    private tipsCategoryService: TipsCategoryService,
  ) {
    this.cancertypesRepository = this.datasource.getRepository(CancerType);
  }

  async findAll() {
    try {
      const alltips = await this.cancertypesRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Cancertypess fetched sucessfully.',
        data: [{ count: alltips.length }, alltips],
        path: '/cancer-types/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch Cancertypes | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch Cancertypess.',
          path: '/Cancertypes/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const types = await this.cancertypesRepository.findOneBy({ id });

      if (!types)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this types.',
            path: '/cancer-typess/types/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'types fetched sucessfully.',
        data: types,
        path: '/cancer-types/types/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this types. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this types.',
          error: error.message,
          path: '/cancer-types/types/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createCancertypesDto: CreateCancerTypesDto) {
    try {
      const cancertypesToSave =
        this.cancertypesRepository.create(createCancertypesDto);

      const tipsSaved =
        await this.cancertypesRepository.save(cancertypesToSave);

      const { id, description, createdAt } = tipsSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'cancer-types created sucessfully',
        data: { id, description, createdAt },
        path: '/cancer-types/create/types',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new cancer-types | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Cancertypes',
          error: error.message,
          path: '/cancer-types/create/types',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updateCancertypesDto: Partial<UpdateCancerTypesDto>,
  ) {
    try {
      await this.cancertypesRepository.update(id, updateCancertypesDto);

      const { createdAt, updatedAt } =
        await this.cancertypesRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'cancer-types updated sucessfully',
        data: {
          id,
          createdAt,
          updatedAt,
        },
        path: '/cancer-types/update/types/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new cancer-types | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update cancer-types',
          error: error.message,
          path: '/cancer-types/update/types/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const tipsToDelete = await this.cancertypesRepository.findOneBy({
        id,
      });
      if (!tipsToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'cancer-types Not Found',
            path: '/cancer-types/types/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.cancertypesRepository.remove(tipsToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'cancer-types deleted sucessfully',
        path: '/cancer-types/delete/types/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete cancer-types | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete cancer-types',
          error: error.message,
          path: '/cancer-types/delete/types/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
