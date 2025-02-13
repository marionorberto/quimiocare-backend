import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tags } from 'src/database/entities/tags/tags.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,
  ) {}

  async findAll() {
    try {
      const allTags = await this.tagsRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Tags fetched sucessfully.',
        data: [{ count: allTags.length }, allTags],
        path: '/tags/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch tags | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch tags.',
          path: '/tags',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createTagDto: CreateTagDto) {
    try {
      const tagToSave = this.tagsRepository.create(createTagDto);

      const { id, description, createdAt } =
        await this.tagsRepository.save(tagToSave);
      return {
        statusCode: 201,
        method: 'POST',
        message: 'Tag created sucessfully',
        data: {
          id,
          description,
          createdAt,
        },
        path: '/tags/create',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to create new Tag | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new Tag',
          error: error.message,
          path: '/tags/create',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string) {
    try {
      const tag = await this.tagsRepository.findOneBy({
        id,
      });

      if (!tag)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this tag.',
            path: '/tags/tag/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Tag fetched sucessfully.',
        data: tag,
        path: '/tags/tag/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this Tag. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this tag.',
          error: error.message,
          path: '/tags/tag/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateOne(id: string, updateTagDto: UpdateTagDto) {
    try {
      await this.tagsRepository.update(id, updateTagDto);

      const { description, createdAt, updatedAt } =
        await this.tagsRepository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Tag updated sucessfully',
        data: {
          id,
          description,
          createdAt,
          updatedAt,
        },
        path: '/tags/update/tag/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to update new Tag | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Tag',
          error: error.message,
          path: '/tags/update/tag/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      const tagToDelete = await this.tagsRepository.findOneBy({ id });
      if (!tagToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Tag Not Found',
            path: '/tags/tag/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.tagsRepository.remove(tagToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Tag deleted sucessfully',
        path: '/tags/delete/tag/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete Tag | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to delete Tag',
          error: error.message,
          path: '/tags/delete/tag/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(tag: string) {
    return await this.tagsRepository.findOne({
      where: {
        description: tag,
      },
    });
  }
}
