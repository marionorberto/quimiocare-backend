import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UpdateUsersDto } from './dtos/update-users.dto';

import { DataSource, Repository } from 'typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Followers } from 'src/database/entities/followers/followers.entity';
@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Followers)
    private readonly followersRepository: Repository<Followers>,
  ) {
    this.userRepository = this.datasource.getRepository(User);
  }

  async findAll() {
    try {
      const allUsers = await this.userRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Users fetched sucessfully.',
        data: [{ count: allUsers.length }, allUsers],
        path: '/users/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch users | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch users.',
          path: '/users/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this user.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
      );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'User fetched sucessfully.',
        data: user,
        path: '/users/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this user. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this user.',
          error: error.message,
          path: '/users/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createUsersDto: CreateUsersDto) {
    try {
      const userToSave = this.userRepository.create(createUsersDto);
      const userSaved = await this.userRepository.save(userToSave);

      const { id, username, email, createdAt } = userSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'User created sucessfully',
        data: {
          id,
          username,
          email,
          password: createUsersDto.password,
          createdAt,
        },
        path: '/users/create/user',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new User',
          error: error.message,
          path: '/users/create/user',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(id: string, updateUsersDto: Partial<UpdateUsersDto>) {
    try {
      await this.userRepository.update(id, updateUsersDto);

      const { username, email, createdAt, updatedAt } =
        await this.userRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'User updated sucessfully',
        data: {
          id,
          username,
          email,
          createdAt,
          updatedAt,
        },
        path: '/users/update/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new User | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update User',
          error: error.message,
          path: '/users/update/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const userToDelete = await this.userRepository.findOneBy({ id });
      if (!userToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.userRepository.remove(userToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'User deleted sucessfully',
        path: '/users/delete/user/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete User',
          error: error.message,
          path: '/users/delete/user/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(data: any) {
    try {
      const userFetched: User = await this.userRepository.findOne(data);
      if (!userFetched)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Email Not Found.',
            path: '/users/user/id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        id: userFetched.id,
        username: userFetched.username,
        password: userFetched.password,
      };
    } catch (error) {
      console.log(`Failed to fetch User | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to fetch User',
          error: error.message,
          path: '/users/user/id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Follow a user
  async followUser(followerId: string, followingId: string) {
    try {
      const userFollower = await this.userRepository.findOne({
        where: { id: followerId },
      });

      const userFollowing = await this.userRepository.findOne({
        where: { id: followingId },
      });

      if (!userFollower || !userFollowing) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found.',
            path: '/users/user/id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (userFollower.id == userFollowing.id) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'GET',
            message: 'Users are the same.',
            path: '/users/user',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const alreadyFollowing = await this.followersRepository.find({
        where: {
          follower: userFollower.id,
          followed: userFollowing.id,
        },
      });

      if (alreadyFollowing.length > 0)
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'User already is following this particular user',
            path: 'users/followerUser/follow/followingUser',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );

      const followerToSave = this.followersRepository.create({
        follower: userFollower.id,
        followed: userFollowing.id,
      });

      const { id, follower, followed, createdAt } =
        await this.followersRepository.save(followerToSave);

      return {
        statusCode: 200,
        method: 'POST',
        message: 'Follower created sucessfully',
        data: {
          id,
          follower,
          followed,
          createdAt,
        },
        path: 'users/followerUser/follow/followingUser',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Follower | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Follower',
          error: error.message,
          path: '/users/followerId/follow/followingId',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    try {
      const userFollower = await this.userRepository.findOne({
        where: { id: followerId },
      });

      const userFollowing = await this.userRepository.findOne({
        where: { id: followingId },
      });

      if (!userFollower || !userFollowing) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found.',
            path: '/users/user/id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (userFollower.id == userFollowing.id) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'GET',
            message: 'Users are the same.',
            path: '/users/user',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const followerToRemove = await this.followersRepository.find({
        where: {
          follower: userFollower.id,
          followed: userFollowing.id,
        },
      });

      if (!followerToRemove)
        throw new HttpException(
          {
            statusCode: 400,
            method: 'DELETE',
            message: 'User is not following this particular user',
            path: 'users/followerUser/follow/followingUser',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );

      await this.followersRepository.remove(followerToRemove);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Follower deleted sucessfully',
        path: '/users/:followerId/follow/:followingId',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to delete Follower | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Follower',
          error: error.message,
          path: '/users/:followerId/follow/followingId',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getFollowers(userId: string) {
    try {
      const allFollowers = await this.followersRepository.find({
        where: { followed: userId },
        select: {
          follower: true,
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Followers fetched sucessfully.',
        data: [{ count: allFollowers.length }, allFollowers],
        path: '/users/:followerId/follow/:followingId',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch Followers | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch Followers.',
          path: '/users/:followerId/follow/:followingId',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getFollowing(userId: string) {
    try {
      const allFollowing = await this.followersRepository.find({
        where: { follower: userId },
        select: {
          followed: true,
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Following fetched sucessfully.',
        data: [{ count: allFollowing.length }, allFollowing],
        path: '/users/:userId/following',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch Following | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch Following.',
          path: '/users/:userId/following',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
