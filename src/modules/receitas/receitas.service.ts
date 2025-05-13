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
import { CreateReceitaDto } from './dtos/create-receita.dto';
import { Request } from 'express';
import { UpdateReceitaDto } from './dtos/update-receita.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { Receitas } from 'src/database/entities/receitas/receita.entity';
@UseGuards(AuthGuard)
@Injectable()
export class ReceitaService {
  private context: ExecutionContext;
  constructor(
    @InjectRepository(Receitas)
    private readonly receitaRepository: Repository<Receitas>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userServices: UsersService,
  ) {}
  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allreceita = await this.receitaRepository
        .createQueryBuilder('receita')
        .where('receita.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'all receitas fetched sucessfully.',
        data: [{ count: allreceita.length }, allreceita],
        path: '/receitas/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch receita | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch receita.',
          path: '/receitas/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createReceitaDto: CreateReceitaDto, request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const receitaToSave = this.receitaRepository.create({
        ...createReceitaDto,
        user: userData,
      });

      const receitaSaved = await this.receitaRepository.save(receitaToSave);

      const { id, name, description, url, user, createdAt } = receitaSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Receita created sucessfully',
        data: {
          id,
          name,
          description,
          url,
          user,
          createdAt,
        },
        path: '/receitas/create/receita',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new receita | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Receita',
          error: error.message,
          path: '/receitas/create/receita',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const receita = await this.receitaRepository.findOneBy({ id });

      if (!receita)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this receita.',
            path: '/receitas/receitas/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'receita fetched sucessfully.',
        data: receita,
        path: '/receitas/receita/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this receita. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this receita.',
          error: error.message,
          path: '/receitas/receita/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(id: string, updatereceitaDto: Partial<UpdateReceitaDto>) {
    try {
      await this.receitaRepository.update(id, updatereceitaDto);

      const {
        id: idReceita,
        name,
        description,
        url,
        createdAt,
        updatedAt,
      } = await this.receitaRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'receita updated sucessfully',
        data: { idReceita, name, description, url, createdAt, updatedAt },
        path: '/receitas/update/receita/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new receita | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update receita',
          error: error.message,
          path: '/receitas/update/receita/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const receitaToDelete = await this.receitaRepository.findOneBy({ id });
      if (!receitaToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'receita Not Found',
            path: '/receitas/receita/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.receitaRepository.remove(receitaToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'receita deleted sucessfully',
        path: '/receitas/delete/receita/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete receita | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete receita',
          error: error.message,
          path: '/receitas/delete/receita/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
