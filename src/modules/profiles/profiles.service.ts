import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/database/entities/profiles/user-profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from 'src/database/entities/users/user.entity';
import { TagsService } from 'src/modules/tags/tags.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tagsService: TagsService,
  ) {}

  async findAll() {
    try {
      const allProfiles = await this.profilesRepository.find({
        relations: {
          user: true,
          tags: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'profiles fetched sucessfully.',
        data: [{ count: allProfiles }, allProfiles],
        path: '/profiles',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch profiles | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch profiles.',
          path: '/profiles/all',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createProfileDto: CreateProfileDto) {
    try {
      const userData = await this.userRepository.findOneBy({
        id: createProfileDto.userId,
      });

      if (!userData) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found.',
            path: '/users/create/user',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const existingTags = await Promise.all(
        createProfileDto.tags.map(async (element) => {
          return await this.tagsService.findOne(element.description);
        }),
      );

      const hasFalsyValue = existingTags.some((element) => !element);

      if (hasFalsyValue) {
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Tags Not Found.',
            path: '/tags/tag/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }
      console.log(userData);

      const profileToSave = this.profilesRepository.create(createProfileDto);

      const profileSaved = await this.profilesRepository.save({
        ...profileToSave,
        tags: existingTags,
        user: userData,
      });

      const {
        id,
        user,
        height,
        weight,
        bio,
        birthday,
        urlImg,
        tags,
        createdAt,
      } = profileSaved;

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Profile created sucessfully',
        data: {
          id,
          user,
          bio,
          birthday,
          urlImg,
          height,
          weight,
          tags,
          createdAt,
        },
        path: '/profiles/create/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Profile | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Profile',
          error: error.message,
          path: '/profiles/create/profile',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const profile = await this.profilesRepository.findOne({
        where: {
          id,
        },
        relations: {
          tags: true,
          user: true,
        },
      });

      if (!profile)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this profile.',
            path: '/profiles',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Profile fetched sucessfully.',
        data: profile,
        path: '/profile',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Profile. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this profile.',
          error: error.message,
          path: '/profile',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(id: string, updateTagDto: Partial<UpdateProfileDto>) {
    try {
      await this.profilesRepository.update(id, updateTagDto);

      const {
        user,
        birthday,
        height,
        weight,
        bio,
        tags,
        urlImg,
        createdAt,
        updatedAt,
      } = await this.profilesRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Profile updated sucessfully',
        data: {
          id,
          user,
          birthday,
          height,
          weight,
          bio,
          tags,
          urlImg,
          createdAt,
          updatedAt,
        },
        path: '/profiles/profile/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Profile | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Profile',
          error: error.message,
          path: '/profiles/profile/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const tagToDelete = await this.profilesRepository.findOneBy({ id });
      if (!tagToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Profile Not Found',
            path: '/profiles/profile/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.profilesRepository.remove(tagToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Profile deleted sucessfully',
        path: '/profiles/delete/profile/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete Profile | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Profile',
          error: error.message,
          path: '/profiles/delete/profile/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
