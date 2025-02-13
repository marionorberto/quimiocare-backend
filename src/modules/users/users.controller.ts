import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @Get('all')
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.usersServices.findAll();
  }

  @Get('user/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByPk(@Param('id') id: string) {
    return await this.usersServices.findByPk(id);
  }

  @Post('create/user')
  create(@Body() createUserDto: CreateUsersDto) {
    return this.usersServices.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): any {
    return req['user'];
  }

  @Put('update/user/:id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    return await this.usersServices.updateOne(id, updateUsersDto);
  }

  @Delete('delete/user/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.usersServices.deleteOne(id);
  }

  // Endpoint to follow a user
  @Post(':followerId/follow/:followingId')
  async followUser(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.usersServices.followUser(followerId, followingId);
  }

  // Endpoint to unfollow a user
  @Delete(':followerId/unfollow/:followingId')
  async unfollowUser(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.usersServices.unfollowUser(followerId, followingId);
  }

  // Endpoint to get followers of a user
  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return this.usersServices.getFollowers(userId);
  }

  // Endpoint to get the users a user is following
  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return this.usersServices.getFollowing(userId);
  }
}
