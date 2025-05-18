import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRepliesDto } from './dtos/create-question-reply.dto';
// import { UpdateRepliesDto } from './dtos/update-question-reply.dto';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/entities/users/user.entity';
import { QuestionReply } from 'src/database/entities/questions-reply/question-reply.entity';
import { Questions } from 'src/database/entities/questions/question.entity';
@Injectable()
export class RepliesService {
  private replyRepository: Repository<QuestionReply>;
  private userRepository: Repository<User>;
  private questionRepository: Repository<Questions>;
  constructor(
    private readonly datasource: DataSource,
    private readonly userServices: UsersService,
  ) {
    this.replyRepository = this.datasource.getRepository(QuestionReply);
    this.userRepository = this.datasource.getRepository(User);
    this.questionRepository = this.datasource.getRepository(Questions);
  }

  async findAll(request: Request) {
    try {
      const { idUser } = request['user'];

      const allMedication = await this.replyRepository
        .createQueryBuilder('medication')
        .where('medication.userId = :userId', {
          userId: idUser,
        })
        .getMany();

      return {
        statusCode: 200,
        method: 'GET',
        message: 'medications fetched sucessfully.',
        data: [{ count: allMedication.length }, allMedication],
        path: '/medications/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch Medications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch medications.',
          path: '/medication/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const medication = await this.replyRepository.findOneBy({ id });

      if (!medication)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this medication.',
            path: '/medications/medication/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Medication fetched sucessfully.',
        data: medication,
        path: '/medications/medication/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this medication. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this medication.',
          error: error.message,
          path: '/medications/medication/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createReplyDto: CreateRepliesDto, request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const question = await this.questionRepository.findOneBy({
        id: createReplyDto.question,
      });

      const replyToSave = this.replyRepository.create({
        ...createReplyDto,
        question: question,
        user: userData,
      });

      const replySaved = await this.replyRepository.save(replyToSave);

      const { id, createdAt } = replySaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Medication created sucessfully',
        data: { id, createdAt },
        path: '/medications/create/medication',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Medication | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Medication',
          error: error.message,
          path: '/medications/create/medication',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async updateOne(id: string, updateRepliesDto: Partial<UpdateRepliesDto>) {
  //   try {
  //     await this.replyRepository.update(id, updateRepliesDto);

  //     const { id, createdAt, updatedAt } = await this.replyRepository.findOneBy({ id });

  //     return {
  //       statusCode: 200,
  //       method: 'PUT',
  //       message: 'Medication updated sucessfully',
  //       data: {
  //         id,
  //         createdAt,
  //         updatedAt,
  //       },
  //       path: '/medications/update/medication/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to update new Medication | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to update Medication',
  //         error: error.message,
  //         path: '/medications/update/medication/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  async deleteOne(id: string) {
    try {
      const medicationToDelete = await this.replyRepository.findOneBy({
        id,
      });
      if (!medicationToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Medication Not Found',
            path: '/medications/medication/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.replyRepository.remove(medicationToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Medication deleted sucessfully',
        path: '/medications/delete/medication/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete Medication | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Medication',
          error: error.message,
          path: '/medication/delete/medication/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async last(request: Request) {
    try {
      const { idUser } = request['user'];

      const [last] = await this.replyRepository.find({
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
        path: '/medications/last',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch medications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch medications.',
          path: '/medications/last',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
