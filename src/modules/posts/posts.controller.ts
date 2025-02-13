import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  // UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CreatePostLikeDto } from './dtos/likes/create-post-like.dto';
import { DeletePostLikeDto } from './dtos/likes/delete-post-like.dto';
import { UpdatePostCommentDto } from './dtos/comments/update-post-comment.dto';
import { CreatePostCommentDto } from './dtos/comments/create-post-comment.dto';
import { CreatePostSaveDto } from './dtos/saved/create-post-save.dto';
import {
  CreateReturn,
  DeleteReturn,
  FindAllReturn,
  FindOneReturn,
  UpdateReturn,
} from './interfaces/return-interfaces';

import { Throttle, SkipThrottle } from '@nestjs/throttler';
// import { AuthGuard } from 'src/auth/auth.guard';

// @SkipThrottle()
// @UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Throttle({ short: { ttl: 10000, limit: 5 } })
  @Get('all')
  async findAll(): Promise<FindAllReturn> {
    return await this.postsService.findAll();
  }

  @SkipThrottle({ default: false })
  @Get('post/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string): Promise<FindOneReturn> {
    return await this.postsService.findByPk(id);
  }

  @Post('create/post')
  async create(@Body() createPostDto: CreatePostDto): Promise<CreateReturn> {
    return await this.postsService.create(createPostDto);
  }

  @Put('update/post/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updatePostsDto: UpdatePostDto,
  ): Promise<UpdateReturn> {
    return await this.postsService.updateOne(id, updatePostsDto);
  }

  @Delete('delete/post/like')
  async dislike(@Body() deletePostLikeDto: DeletePostLikeDto) {
    return await this.postsService.dislike(deletePostLikeDto);
  }

  @Delete('delete/post/:id')
  async deleteOne(@Param('id') id: string): Promise<DeleteReturn> {
    return await this.postsService.deleteOne(id);
  }

  @Post('post/save')
  async save(@Body() createPostSaveDto: CreatePostSaveDto) {
    return await this.postsService.save(createPostSaveDto);
  }

  @Post('post/like')
  async like(@Body() postLikeDto: CreatePostLikeDto) {
    return await this.postsService.like(postLikeDto);
  }

  @Post('post/comment')
  async comment(@Body() createPostCommentDto: CreatePostCommentDto) {
    return await this.postsService.comment(createPostCommentDto);
  }

  @Delete('delete/comment/:id')
  async uncomment(@Param('id') id: string) {
    return await this.postsService.uncomment(id);
  }

  @Put('update/post/comment/:id')
  async updateComment(
    @Body() updatePostComment: UpdatePostCommentDto,
    @Param('id') id: string,
  ) {
    return await this.postsService.updateComment(updatePostComment, id);
  }

  @Delete('delete/post/save/:id')
  async unsave(@Param('id') id: string) {
    return await this.postsService.unsave(id);
  }
}
