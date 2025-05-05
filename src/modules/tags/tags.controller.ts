import {
  Controller,
  Param,
  Body,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth/auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get('all')
  async fillAll() {
    return await this.tagsService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('tag/:id')
  async findByPk(@Param('id') id: string) {
    return await this.tagsService.findByPk(id);
  }
  @Post('create/tag')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @UseGuards(AuthGuard)
  @Put('update/tag/:id')
  async updateOne(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.updateOne(id, updateTagDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/tag/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.tagsService.deleteOne(id);
  }
}
