import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { Repository } from 'typeorm';
import { UserFeedback } from 'src/database/entities/user-feedback/user-feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFeedbackDto } from './dtos/update-feedback.dto';
import {
  CreateReturn,
  DeleteReturn,
  FindAllReturn,
  FindOneReturn,
  UpdateReturn,
} from './interfaces/return-interfaces';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(UserFeedback)
    private readonly feedbackRepository: Repository<UserFeedback>,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<FindAllReturn> {
    try {
      const allFeedback = await this.feedbackRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'all feedbacks fetched sucessfully.',
        data: [{ count: allFeedback.length }, allFeedback],
        path: '/feedback/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch feedback | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to feedback feedback.',
          path: '/feedback/all',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string): Promise<FindOneReturn> {
    try {
      const feedback = await this.feedbackRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
        },
      });

      if (!feedback)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this feedback.',
            path: '/feedback/feedback/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'feedback fetched sucessfully.',
        data: feedback,
        path: '/feedback/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this feedback. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this feedback.',
          error: error.message,
          path: '/feedback/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(
    createFeedbackDto: CreateFeedbackDto,
    request: Request,
  ): Promise<CreateReturn> {
    try {
      const { idUserFromRequest } = request['user'];

      const { data: userData } =
        await this.userService.findByPk(idUserFromRequest);

      const feedbackToSave = this.feedbackRepository.create({
        ...createFeedbackDto,
        user: userData,
      });

      const { id, comment, avaliation, dateSent, user } =
        await this.feedbackRepository.save({
          ...feedbackToSave,
          user: userData,
        });

      return {
        statusCode: 201,
        method: 'feedback',
        message: 'feedback created sucessfully',
        data: { id, comment, avaliation, dateSent, user },
        path: '/create/feedback',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new feedback | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'feedback',
          message: 'Failed to create new feedback',
          error: error.message,
          path: '/create/feedback',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updatefeedbacksDto: Partial<UpdateFeedbackDto>,
  ): Promise<UpdateReturn> {
    try {
      await this.feedbackRepository.update(id, updatefeedbacksDto);

      const { user, avaliation, comment, createdAt, updatedAt } =
        await this.feedbackRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'feedback updated sucessfully',
        data: {
          id,
          user,
          avaliation,
          comment,

          createdAt,
          updatedAt,
        },
        path: '/update/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new feedback | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update feedback',
          error: error.message,
          path: '/update/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string): Promise<DeleteReturn> {
    try {
      const feedbackToDelete = await this.feedbackRepository.findOneBy({
        id,
      });

      if (!feedbackToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'PUT',
            message: 'feedback Not Found',
            path: '/delete/feedback/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.feedbackRepository.remove(feedbackToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'feedback deleted sucessfully',
        path: '/delete/feedback/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete feedback | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to delete feedback',
          error: error.message,
          path: '/delete/feedback/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
