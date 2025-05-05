import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Posts } from 'src/database/entities/posts/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from 'src/database/entities/users/user.entity';
import { TagsService } from 'src/modules/tags/tags.service';
import { CreatePostLikeDto } from './dtos/likes/create-post-like.dto';
import { PostLikes } from 'src/database/entities/posts-likes/posts-likes.entity';
import { DeletePostLikeDto } from './dtos/likes/delete-post-like.dto';
import { UpdatePostCommentDto } from './dtos/comments/update-post-comment.dto';
import { CreatePostCommentDto } from './dtos/comments/create-post-comment.dto';
import { PostComments } from 'src/database/entities/posts-comments/posts-comments.entity';
import { CreatePostSaveDto } from './dtos/saved/create-post-save.dto';
import { PostSaved } from 'src/database/entities/posts-saved/posts-saved.entity';
import {
  CreateReturn,
  DeleteReturn,
  FindAllReturn,
  FindOneReturn,
  UpdateReturn,
} from './interfaces/return-interfaces';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRespository: Repository<Posts>,
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly tagsService: TagsService,
    @InjectRepository(PostLikes)
    private readonly postLikesRespository: Repository<PostLikes>,
    @InjectRepository(PostComments)
    private readonly postCommentsRespository: Repository<PostComments>,
    @InjectRepository(PostSaved)
    private readonly postSavedRepository: Repository<PostSaved>,
  ) {}

  async findAll(): Promise<FindAllReturn> {
    try {
      const allPosts = await this.userRespository.find({
        relations: {
          post: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Posts fetched sucessfully.',
        data: [{ count: allPosts.length }, allPosts],
        path: '/posts/all',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to fetch posts | Error Message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to posts posts.',
          path: '/posts/all',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPk(id: string): Promise<FindOneReturn> {
    try {
      const post = await this.postRespository.findOne({
        where: {
          id,
        },
        relations: {
          sections: true,
          user: true,
          // tags: true,
        },
      });

      if (!post)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Failure to fetch this post.',
            path: '/posts/post/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      return {
        statusCode: 200,
        method: 'GET',
        message: 'Post fetched sucessfully.',
        data: post,
        path: '/posts/post/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch this post. | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 404,
          method: 'GET',
          message: 'Failed to fetch this post.',
          error: error.message,
          path: '/posts/post/:id',
          timestamp: Date.now(),
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(createPostDto: CreatePostDto): Promise<CreateReturn> {
    try {
      const userData = await this.userRespository.findOneBy({
        id: createPostDto.userId,
      });

      if (createPostDto.sections) {
        createPostDto.sections.map((value, index) => {
          value.sectionOrder = ++index;
        });
      }

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

      const postToSave = this.postRespository.create(createPostDto);

      postToSave.user = userData;

      const existingTags = await Promise.all(
        createPostDto.tags.map(async (element) => {
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

      const { id, user, title, tags, linkPosterFile, sections, createdAt } =
        await this.postRespository.save({ ...postToSave, tags: existingTags });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'Post created sucessfully',
        data: {
          id,
          userId: user.id,
          title,
          tags,
          linkPosterFile,
          sections,
          createdAt,
        },
        path: '/create/post',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new Post | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new POST',
          error: error.message,
          path: '/create/post',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOne(
    id: string,
    updatePostsDto: Partial<UpdatePostDto>,
  ): Promise<UpdateReturn> {
    try {
      await this.postRespository.update(id, updatePostsDto);

      const {
        user,
        title,
        // tags,
        linkPosterFile,
        sections,
        createdAt,
        updatedAt,
      } = await this.postRespository.findOneBy({ id });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Post updated sucessfully',
        data: {
          id,
          user,
          title,
          // tags,
          linkPosterFile,
          sections,
          createdAt,
          updatedAt,
        },
        path: '/update/post/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update new Post | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Post',
          error: error.message,
          path: '/update/post/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(id: string): Promise<DeleteReturn> {
    try {
      const postToDelete = await this.postRespository.findOneBy({
        id,
      });

      if (!postToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'PUT',
            message: 'Post Not Found',
            path: '/delete/post/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.postRespository.remove(postToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Post deleted sucessfully',
        path: '/delete/post/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete Post | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to delete Post',
          error: error.message,
          path: '/delete/post/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async like(createPostLikeDto: CreatePostLikeDto) {
    try {
      const userData = await this.userRespository.findOneBy({
        id: createPostLikeDto.userId,
      });

      if (!userData)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const postData = await this.postRespository.findOneBy({
        id: createPostLikeDto.postId,
      });

      if (!postData)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Post Not Found.',
            path: '/posts/post/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const allLiked = await this.postLikesRespository.query(
        `select * from Post_Likes where postId='${createPostLikeDto.postId}' and userId='${createPostLikeDto.userId}'`,
      );

      if (allLiked.length > 0)
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'User already like this post',
            path: '/post/like/:id',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );

      const postSavedToSave =
        this.postLikesRespository.create(createPostLikeDto);

      postSavedToSave.user = userData;
      postSavedToSave.post = postData;
      const { postLikeId, like, post, user, createdAt } =
        await this.postLikesRespository.save(postSavedToSave);

      return {
        statusCode: 200,
        method: 'POST',
        data: {
          id: postLikeId,
          like,
          post,
          user,
          createdAt,
        },
        message: 'Post Liked sucessfully',
        path: '/post/like/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to like post | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to like post',
          error: error.message,
          path: '/post/like/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async dislike(deletePostLikeDto: DeletePostLikeDto) {
    try {
      const postToDislike = await this.postLikesRespository.query(
        `select * from Post_Likes where postId='${deletePostLikeDto.postId}' and userId='${deletePostLikeDto.userId}'`,
      );
      console.log(postToDislike);
      if (!postToDislike.length)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message:
              'Post Was Not Liked Yet By This User or User/Post does not exist',
            path: '/posts/post/like',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.postLikesRespository.query(
        `delete from Post_Likes where postId='${deletePostLikeDto.postId}' and userId='${deletePostLikeDto.userId}'`,
      );

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Post Disliked sucessfully',
        path: 'delete/post/like',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to delete Post | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to dislike Post',
          error: error.message,
          path: '/delete/post/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async comment(createPostCommentDto: CreatePostCommentDto) {
    try {
      const userData = await this.userRespository.findOneBy({
        id: createPostCommentDto.userId,
      });

      if (!userData)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const postData = await this.postRespository.findOneBy({
        id: createPostCommentDto.postId,
      });

      if (!postData)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Post Not Found.',
            path: '/posts/post/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const allPostComment = await this.postLikesRespository.query(
        `select * from Post_Comments where postId='${createPostCommentDto.postId}' and userId='${createPostCommentDto.userId}'`,
      );

      if (allPostComment.length > 0)
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'User already comment this post',
            path: '/posts/post/comment',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );

      const commentToSave =
        this.postCommentsRespository.create(createPostCommentDto);

      const { postCommentId, comment, post, user, createdAt } =
        await this.postCommentsRespository.save({
          ...commentToSave,
          post: postData,
          user: userData,
        });
      return {
        statusCode: 201,
        method: 'POST',
        message: 'Post Comment created sucessfully',
        data: {
          id: postCommentId,
          comment,
          post,
          user,
          createdAt,
        },
        path: 'posts/post/comment',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create Post Comment | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create Post Comment',
          error: error.message,
          path: 'posts/post/comment',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uncomment(id: string) {
    try {
      const commentToDelete = await this.postCommentsRespository.findOneBy({
        postCommentId: id,
      });

      if (!commentToDelete)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'Get',
            message: 'Post Comment Not Found.',
            path: 'posts/post/comment',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.postCommentsRespository.remove(commentToDelete);

      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Post Comment deleted sucessfully',
        path: '/delete/post/comment/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to Delete Post Comment | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to delete Post Comment',
          error: error.message,
          path: 'posts/post/comment',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateComment(
    updatePostComment: Partial<UpdatePostCommentDto>,
    id: string,
  ) {
    try {
      const commentToUpdate = await this.postCommentsRespository.findOneBy({
        postCommentId: id,
      });

      if (!commentToUpdate)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'Get',
            message: 'Post Comment Not.',
            path: 'posts/post/comment',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.postCommentsRespository.update(id, updatePostComment);

      const { postCommentId, comment, post, user, createdAt, updateAt } =
        await this.postCommentsRespository.findOneBy({
          postCommentId: id,
        });

      return {
        statusCode: 200,
        method: 'PUT',
        message: 'Post updated sucessfully',
        data: {
          id: {
            id: postCommentId,
            comment,
            post,
            user,
            createdAt,
            updateAt,
          },
          comment,
          post,
          user,
          createdAt,
          updateAt,
        },
        path: '/update/post/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to update Post Comment | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'PUT',
          message: 'Failed to update Post Comment',
          error: error.message,
          path: '/update/post/comment/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async save(createPostSaveDto: CreatePostSaveDto) {
    try {
      const userData = await this.userRespository.findOneBy({
        id: createPostSaveDto.userId,
      });

      if (!userData)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'User Not Found.',
            path: '/users/user/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const postData = await this.postRespository.findOneBy({
        id: createPostSaveDto.postId,
      });

      if (!postData)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message: 'Post Not Found.',
            path: '/posts/post/:id',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      const isAnyAlreadySaved = await this.postLikesRespository.query(
        `select * from Post_Saved where postId='${createPostSaveDto.postId}' and userId='${createPostSaveDto.userId}'`,
      );

      if (isAnyAlreadySaved.length > 0)
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'User already save this post',
            path: 'posts/post/save/:id',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );

      const postSavedToSave =
        this.postSavedRepository.create(createPostSaveDto);

      const { postSaveId, saved, post, user, createdAt } =
        await this.postSavedRepository.save({
          ...postSavedToSave,
          user: userData,
          post: postData,
        });

      return {
        statusCode: 200,
        method: 'POST',
        data: {
          id: postSaveId,
          saved,
          post,
          user,
          createdAt,
        },
        message: 'Post saved sucessfully',
        path: '/post/save',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to save post | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to save post',
          error: error.message,
          path: '/post/save',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unsave(id: string) {
    try {
      const postToUnsave = await this.postSavedRepository.findOneBy({
        postSaveId: id,
      });

      if (!postToUnsave)
        throw new HttpException(
          {
            statusCode: 404,
            method: 'GET',
            message:
              'Post Was Not saved Yet By This User or User/Post does not exist',
            path: '/posts/post/save',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );

      await this.postSavedRepository.remove(postToUnsave);
      return {
        statusCode: 200,
        method: 'DELETE',
        message: 'Post Unsaved sucessfully',
        path: 'delete/post/save/:id',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to unsave Post | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'DELETE',
          message: 'Failed to unsave Post',
          error: error.message,
          path: '/delete/post/save/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
