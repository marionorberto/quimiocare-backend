import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.questionService.findAll(request);
  }

  @Get('todas')
  async todas() {
    return await this.questionService.todas();
  }

  @Post('create/question')
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Req() request: Request,
  ) {
    return this.questionService.create(createQuestionDto, request);
  }

  @Put('update/question/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updatequestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.updateOne(id, updatequestionDto);
  }

  @Delete('delete/question/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.questionService.deleteOne(id);
  }

  @Get('last')
  async last(@Req() request: Request) {
    return await this.questionService.last(request);
  }
}
