import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  // Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { RepliesService } from './question-reply.service';
import { CreateRepliesDto } from './dtos/create-question-reply.dto';
// import { UpdateRepliesDto } from './dtos/update-question-reply.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Req() request: Request) {
    return await this.repliesService.findAll(request);
  }

  @Get('reply/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.repliesService.findByPk(id);
  }

  @Post('create/reply')
  create(@Body() createreplyDto: CreateRepliesDto, @Req() request: Request) {
    return this.repliesService.create(createreplyDto, request);
  }

  // @Put('update/reply/:id')
  // async updateOne(
  //   @Param('id') id: string,
  //   @Body() updatereplyDto: UpdateRepliesDto,
  // ) {
  //   return await this.repliesService.updateOne(id, updatereplyDto);
  // }

  @Delete('delete/reply/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.repliesService.deleteOne(id);
  }

  @Get('last')
  async last(@Req() request: Request) {
    return await this.repliesService.last(request);
  }
}
