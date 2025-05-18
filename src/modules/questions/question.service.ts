import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { Questions } from 'src/database/entities/questions/question.entity';
@Injectable()
export class QuestionService {
  private questionRepository: Repository<Questions>;
  private userRepository: Repository<User>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userServices: UsersService,
  ) {
    this.questionRepository = this.datasource.getRepository(Questions);
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allquestion = await this.questionRepository
        .createQueryBuilder('question')
        .where('question.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'questions fetched sucessfully.',
        data: [{ count: allquestion.length }, allquestion],
        path: '/questions/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch questions | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch questions.',
          path: '/question/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const question = await this.questionRepository.findOneBy({ id });

      if (!question)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this question.',
            path: '/questions/question/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'question fetched sucessfully.',
        data: question,
        path: '/questions/question/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this question. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this question.',
          error: error.message,
          path: '/questions/question/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createquestionDto: CreateQuestionDto, request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const questionToSave = this.questionRepository.create({
        ...createquestionDto,
        user: userData,
      });

      const questionSaved = await this.questionRepository.save(questionToSave);

      const { id, question, createdAt } = questionSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'question created sucessfully',
        data: { id, question, createdAt },
        path: '/questions/create/question',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new question | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new question',
          error: error.message,
          path: '/questions/create/question',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(id: string, updatequestionDto: Partial<UpdateQuestionDto>) {
    try {
      await this.questionRepository.update(id, updatequestionDto);

      const { question, createdAt, updatedAt } =
        await this.questionRepository.findOneBy({
          id,
        });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'question updated sucessfully',
        data: {
          id,
          question,
          createdAt,
          updatedAt,
        },
        path: '/questions/update/question/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new question | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update question',
          error: error.message,
          path: '/questions/update/question/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const questionToDelete = await this.questionRepository.findOneBy({
        id,
      });
      if (!questionToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'question Not Found',
            path: '/questions/question/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.questionRepository.remove(questionToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'question deleted sucessfully',
        path: '/questions/delete/question/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete question | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete question',
          error: error.message,
          path: '/question/delete/question/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async last(request: Request) {
    try {
      const { idUser } = request['user'];

      const [last] = await this.questionRepository.find({
        where: {
          user: {
            id: idUser,
          },
        },
        order: { createdAt: 'DESC' },
        take: 1,
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'last me fetched sucessfully.',
        data: [last],
        path: '/questions/last',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch questions | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch questions.',
          path: '/questions/last',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
