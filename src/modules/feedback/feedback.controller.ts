import {
  Controller,
  Delete,
  Param,
  Body,
  Get,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { UpdateFeedbackDto } from './dtos/update-feedback.dto';
import {
  CreateReturn,
  DeleteReturn,
  FindAllReturn,
  FindOneReturn,
  UpdateReturn,
} from './interfaces/return-interfaces';
import { Request } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from 'src/shared/auth/auth.guard';

@SkipThrottle()
@UseGuards(AuthGuard)
@Controller('feedbacks')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Throttle({ short: { ttl: 10000, limit: 5 } })
  @Get('all')
  async findAll(): Promise<FindAllReturn> {
    return await this.feedbackService.findAll();
  }

  @SkipThrottle({ default: false })
  @Get('feedback/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string): Promise<FindOneReturn> {
    return await this.feedbackService.findByPk(id);
  }

  @Post('create/feedback')
  async create(
    @Body() createfeebackDto: CreateFeedbackDto,
    @Req() request: Request,
  ): Promise<CreateReturn> {
    return await this.feedbackService.create(createfeebackDto, request);
  }

  @Put('update/feedback/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updatefeebacksDto: UpdateFeedbackDto,
  ): Promise<UpdateReturn> {
    return await this.feedbackService.updateOne(id, updatefeebacksDto);
  }

  @Delete('delete/feedback/:id')
  async deleteOne(@Param('id') id: string): Promise<DeleteReturn> {
    return await this.feedbackService.deleteOne(id);
  }
}
