import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  // UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { Request } from 'express';

// @SkipThrottle()
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Req() request: Request) {
    return await this.postsService.findAll(request);
  }

  @Get('todas')
  async todas() {
    return await this.postsService.todas();
  }

  // @SkipThrottle({ default: false })
  // @Get('post/:id')
  // @UseInterceptors(ClassSerializerInterceptor)
  // async findByPk(@Param('id') id: string): Promise<FindOneReturn> {
  //   return await this.postsService.findByPk(id);
  // }

  @UseGuards(AuthGuard)
  @Post('create/post')
  async create(
    @Req() request: Request,
    @Body() createPostDto: CreatePostDto,
  ): Promise<any> {
    return await this.postsService.create(request, createPostDto);
  }

  // @Put('update/post/:id')
  // async updateOne(
  //   @Param('id') id: string,
  //   @Body() updatePostsDto: UpdatePostDto,
  // ): Promise<UpdateReturn> {
  //   return await this.postsService.updateOne(id, updatePostsDto);
  // }

  // @Delete('delete/post/like')
  // async dislike(@Body() deletePostLikeDto: DeletePostLikeDto) {
  //   return await this.postsService.dislike(deletePostLikeDto);
  // }

  // @Delete('delete/post/:id')
  // async deleteOne(@Param('id') id: string): Promise<DeleteReturn> {
  //   return await this.postsService.deleteOne(id);
  // }

  // @Post('post/save')
  // async save(@Body() createPostSaveDto: CreatePostSaveDto) {
  //   return await this.postsService.save(createPostSaveDto);
  // }

  // @Post('post/like')
  // async like(@Body() postLikeDto: CreatePostLikeDto) {
  //   return await this.postsService.like(postLikeDto);
  // }

  // @Post('post/comment')
  // async comment(@Body() createPostCommentDto: CreatePostCommentDto) {
  //   return await this.postsService.comment(createPostCommentDto);
  // }

  // @Delete('delete/comment/:id')
  // async uncomment(@Param('id') id: string) {
  //   return await this.postsService.uncomment(id);
  // }

  // @Put('update/post/comment/:id')
  // async updateComment(
  //   @Body() updatePostComment: UpdatePostCommentDto,
  //   @Param('id') id: string,
  // ) {
  //   return await this.postsService.updateComment(updatePostComment, id);
  // }

  // @Delete('delete/post/save/:id')
  // async unsave(@Param('id') id: string) {
  //   return await this.postsService.unsave(id);
  // }
}
