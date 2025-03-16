import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCancerStageDto } from './dtos/create-cancer-stage.dto';
import { UpdateCancerStageDto } from './dtos/update-cancer-stage.dto';

import { DataSource, Repository } from 'typeorm';
import { TipsCategoryService } from '../tips-category/tips-category.service';
import { CancerStage } from 'src/database/entities/cancer-stage/cancer-stage.entity';
@Injectable()
export class CancerStageService {
  private cancerStageRepository: Repository<CancerStage>;
  constructor(
    private readonly datasource: DataSource,
    private tipsCategoryService: TipsCategoryService,
  ) {
    this.cancerStageRepository = this.datasource.getRepository(CancerStage);
  }

  async findAll() {
    try {
      const alltips = await this.cancerStageRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'CancerStages fetched sucessfully.',
        data: [{ count: alltips.length }, alltips],
        path: '/cancer-stage/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch CancerStage | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch CancerStages.',
          path: '/CancerStage/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const stage = await this.cancerStageRepository.findOneBy({ id });

      if (!stage)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this stage.',
            path: '/cancer-stages/stage/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'stage fetched sucessfully.',
        data: stage,
        path: '/cancer-stage/stage/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this stage. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this stage.',
          error: error.message,
          path: '/cancer-stage/stage/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createCancerStageDto: CreateCancerStageDto) {
    try {
      const cancerStageToSave =
        this.cancerStageRepository.create(createCancerStageDto);

      const tipsSaved =
        await this.cancerStageRepository.save(cancerStageToSave);

      const { id, description, createdAt } = tipsSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'cancer-stage created sucessfully',
        data: { id, description, createdAt },
        path: '/cancer-stages/create/stage',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new cancerStage | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new CancerStage',
          error: error.message,
          path: '/cancer-stage/create/stage',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updateCancerStageDto: Partial<UpdateCancerStageDto>,
  ) {
    try {
      await this.cancerStageRepository.update(id, updateCancerStageDto);

      const { createdAt, updatedAt } =
        await this.cancerStageRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'cancer-stage updated sucessfully',
        data: {
          id,
          createdAt,
          updatedAt,
        },
        path: '/cancer-stage/update/stage/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new cancer-stage | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update cancer-stage',
          error: error.message,
          path: '/cancer-stage/update/stage/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const tipsToDelete = await this.cancerStageRepository.findOneBy({
        id,
      });
      if (!tipsToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'cancer-stage Not Found',
            path: '/cancer-stage/stage/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.cancerStageRepository.remove(tipsToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'cancer-stage deleted sucessfully',
        path: '/cancer-stage/delete/stage/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete cancer-stage | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete cancer-stage',
          error: error.message,
          path: '/cancer-stage/delete/stage/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
