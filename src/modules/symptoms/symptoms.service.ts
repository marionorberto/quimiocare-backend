import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
  ExecutionContext,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Symptom } from 'src/database/entities/symptoms/symptom.entity';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Repository } from 'typeorm';
import { CreateSymptomDto } from './dtos/create-symptom.dto';
import { Request } from 'express';
import { UpdateSymptomDto } from './dtos/update-symptom.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
@UseGuards(AuthGuard)
@Injectable()
export class SymptomsService {
  private context: ExecutionContext;
  constructor(
    @InjectRepository(Symptom)
    private readonly symptomRepository: Repository<Symptom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userServices: UsersService,
  ) {}
  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allSymptom = await this.symptomRepository
        .createQueryBuilder('symptom')
        .where('symptom.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'all symptoms fetched sucessfully.',
        data: [{ count: allSymptom.length }, allSymptom],
        path: '/symptoms/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch Symptom | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch symptom.',
          path: '/symptoms/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createSymptomDto: CreateSymptomDto, request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const symptomToSave = this.symptomRepository.create({
        ...createSymptomDto,
        user: userData,
      });

      const symptomSaved = await this.symptomRepository.save(symptomToSave);

      const { id, name, description, severity, user, createdAt } = symptomSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Symptom created sucessfully',
        data: {
          id,
          name,
          description,
          severity,
          user,
          createdAt,
        },
        path: '/symptoms/create/sympton',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Symptom | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Symptom',
          error: error.message,
          path: '/symptoms/create/symptom',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const symptom = await this.symptomRepository.findOneBy({ id });

      if (!symptom)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this symptom.',
            path: '/symptoms/symptom/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'symptom fetched sucessfully.',
        data: symptom,
        path: '/symptoms/symptom/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this symptom. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this symptom.',
          error: error.message,
          path: '/symptoms/symptom/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(id: string, updateSymptomDto: Partial<UpdateSymptomDto>) {
    try {
      await this.symptomRepository.update(id, updateSymptomDto);

      const {
        id: idSymptom,
        name,
        description,
        severity,
        createdAt,
        updatedAt,
      } = await this.symptomRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Symptom updated sucessfully',
        data: { idSymptom, name, description, severity, createdAt, updatedAt },
        path: '/symptoms/update/symptom/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Symptom | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Symptom',
          error: error.message,
          path: '/symptoms/update/symptom/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const symptomToDelete = await this.symptomRepository.findOneBy({ id });
      if (!symptomToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'symptom Not Found',
            path: '/symptoms/symptom/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.symptomRepository.remove(symptomToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'symptom deleted sucessfully',
        path: '/symptoms/delete/symptom/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete symptom | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete symptom',
          error: error.message,
          path: '/symptoms/delete/symptom/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
