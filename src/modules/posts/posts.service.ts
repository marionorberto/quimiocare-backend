import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Posts } from 'src/database/entities/posts/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users/user.entity';
import { TagsService } from 'src/modules/tags/tags.service';
import { Request } from 'express';
import { Profile } from 'src/database/entities/profiles/user-profile.entity';
import { ProfileDoctor } from 'src/database/entities/profiles-doctor/user-profile-doctor.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRespository: Repository<Posts>,
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly tagsService: TagsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ProfileDoctor)
    private readonly profileDoctorRepository: Repository<ProfileDoctor>,
  ) {}

  async todas() {
    try {
      let posts = await this.postRespository.find({
        relations: {
          user: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (posts.length > 0) {
        const postWithPostIncluded = await Promise.all(
          posts.map(async (item) => {
            if (item.user.typeUser == 'DOCTOR') {
              const profileDoctorData =
                await this.profileDoctorRepository.findOne({
                  where: {
                    user: {
                      id: item.user.id,
                    },
                  },
                  relations: {
                    user: true,
                  },
                  order: {
                    createdAt: 'DESC',
                  },
                });

              return { ...item, imgUrl: profileDoctorData.urlImg };
            } else if (item.user.typeUser == 'PACIENTE') {
              const profileUserData = await this.profileRepository.findOne({
                where: {
                  user: {
                    id: item.user.id,
                  },
                },
                relations: {
                  user: true,
                },
                order: {
                  createdAt: 'DESC',
                },
              });

              // item.imgUrl = profileUserData.urlImg;
              return { ...item, imgUrl: profileUserData.urlImg };
            } else {
              return;
            }
          }),
        );

        posts = postWithPostIncluded;
      }

      return {
        statusCode: 200,
        method: 'GET',
        message: 'post fetched sucessfully.',
        data: [{ count: posts.length }, posts],
        path: '/posts/post',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch notifications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch notifications.',
          path: '/notifications/notification/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(request: Request) {
    try {
      const { idUser: idUserFromRequest } = request['user'];

      let newPostWithImageProfile = [];

      // const userData = await this.userRepository.findOneBy({
      //   id: idUserFromRequest,
      // });

      // const { data }: { data: User } = await this.userServices.findByPk(userId);
      const posts = await this.postRespository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: idUserFromRequest,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (posts.length > 0) {
        const postWithPostIncluded = await Promise.all(
          posts.map(async (item) => {
            if (item.user.typeUser == 'DOCTOR') {
              const profileDoctorData =
                await this.profileDoctorRepository.findOne({
                  where: {
                    user: {
                      id: item.user.id,
                    },
                  },
                  relations: {
                    user: true,
                  },
                  order: {
                    createdAt: 'DESC',
                  },
                });

              return { ...item, imgUrl: profileDoctorData.urlImg };
            } else if (item.user.typeUser == 'PACIENTE') {
              const profileUserData = await this.profileRepository.findOne({
                where: {
                  user: {
                    id: item.user.id,
                  },
                },
                relations: {
                  user: true,
                },
                order: {
                  createdAt: 'DESC',
                },
              });

              // item.imgUrl = profileUserData.urlImg;
              return { ...item, imgUrl: profileUserData.urlImg };
            } else {
              return;
            }
          }),
        );

        newPostWithImageProfile = postWithPostIncluded;
      }

      return {
        statusCode: 200,
        method: 'GET',
        message: 'post fetched sucessfully.',
        data: [
          {
            count: newPostWithImageProfile.length,
          },
          newPostWithImageProfile,
        ],
        path: '/posts/post/:userId',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to fetch notifications | Error Message: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: 400,
          method: 'GET',
          message: 'Failure to fetch notifications.',
          path: '/notifications/notification/:id',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async findByPk(id: string): Promise<FindOneReturn> {
  //   try {
  //     const post = await this.postRespository.findOne({
  //       where: {
  //         id,
  //       },
  //       relations: {
  //         sections: true,
  //         user: true,
  //         // tags: true,
  //       },
  //     });

  //     if (!post)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'Failure to fetch this post.',
  //           path: '/posts/post/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     return {
  //       statusCode: 200,
  //       method: 'GET',
  //       message: 'Post fetched sucessfully.',
  //       data: post,
  //       path: '/posts/post/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to fetch this post. | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 404,
  //         method: 'GET',
  //         message: 'Failed to fetch this post.',
  //         error: error.message,
  //         path: '/posts/post/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  async create(
    request: Request,
    createNotificationsDto: Partial<CreatePostDto>,
  ) {
    console.log(createNotificationsDto);
    try {
      const { idUser: idUserFromRequest } = request['user'];

      const userData = await this.userRepository.findOneBy({
        id: idUserFromRequest,
      });

      const postToSave = this.postRespository.create(createNotificationsDto);

      const { id, user, title, subtitle, content, tag, img, createdAt } =
        await this.postRespository.save({
          ...postToSave,
          user: userData,
        });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'post created sucessfully',
        data: {
          id,
          user,
          title,
          subtitle,
          content,
          tag,
          img,
          createdAt,
        },
        path: '/post',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(
        `Failed to create new post | Error Message: ${error.message}`,
      );

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to create new post',
          error: error.message,
          path: '/posts',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // async updateOne(
  //   id: string,
  //   updatePostsDto: Partial<UpdatePostDto>,
  // ): Promise<UpdateReturn> {
  //   try {
  //     await this.postRespository.update(id, updatePostsDto);

  //     const {
  //       user,
  //       title,
  //       linkPosterFile,
  //       sections,
  //       createdAt,
  //       updatedAt,
  //     } = await this.postRespository.findOneBy({ id });

  //     return {
  //       statusCode: 200,
  //       method: 'PUT',
  //       message: 'Post updated sucessfully',
  //       data: {
  //         id,
  //         user,
  //         title,
  //         // tags,
  //         linkPosterFile,
  //         sections,
  //         createdAt,
  //         updatedAt,
  //       },
  //       path: '/update/post/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to update new Post | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to update Post',
  //         error: error.message,
  //         path: '/update/post/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async deleteOne(id: string): Promise<DeleteReturn> {
  //   try {
  //     const postToDelete = await this.postRespository.findOneBy({
  //       id,
  //     });

  //     if (!postToDelete)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'PUT',
  //           message: 'Post Not Found',
  //           path: '/delete/post/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     await this.postRespository.remove(postToDelete);

  //     return {
  //       statusCode: 200,
  //       method: 'DELETE',
  //       message: 'Post deleted sucessfully',
  //       path: '/delete/post/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(`Failed to delete Post | Error Message: ${error.message}`);

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to delete Post',
  //         error: error.message,
  //         path: '/delete/post/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async like(createPostLikeDto: CreatePostLikeDto) {
  //   try {
  //     const userData = await this.userRespository.findOneBy({
  //       id: createPostLikeDto.userId,
  //     });

  //     if (!userData)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'User Not Found.',
  //           path: '/users/user/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     const postData = await this.postRespository.findOneBy({
  //       id: createPostLikeDto.postId,
  //     });

  //     if (!postData)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'Post Not Found.',
  //           path: '/posts/post/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     const allLiked = await this.postLikesRespository.query(
  //       `select * from Post_Likes where postId='${createPostLikeDto.postId}' and userId='${createPostLikeDto.userId}'`,
  //     );

  //     if (allLiked.length > 0)
  //       throw new HttpException(
  //         {
  //           statusCode: 400,
  //           method: 'POST',
  //           message: 'User already like this post',
  //           path: '/post/like/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     const postSavedToSave =
  //       this.postLikesRespository.create(createPostLikeDto);

  //     postSavedToSave.user = userData;
  //     postSavedToSave.post = postData;
  //     const { postLikeId, like, post, user, createdAt } =
  //       await this.postLikesRespository.save(postSavedToSave);

  //     return {
  //       statusCode: 200,
  //       method: 'POST',
  //       data: {
  //         id: postLikeId,
  //         like,
  //         post,
  //         user,
  //         createdAt,
  //       },
  //       message: 'Post Liked sucessfully',
  //       path: '/post/like/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(`Failed to like post | Error Message: ${error.message}`);

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'POST',
  //         message: 'Failed to like post',
  //         error: error.message,
  //         path: '/post/like/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async dislike(deletePostLikeDto: DeletePostLikeDto) {
  //   try {
  //     const postToDislike = await this.postLikesRespository.query(
  //       `select * from Post_Likes where postId='${deletePostLikeDto.postId}' and userId='${deletePostLikeDto.userId}'`,
  //     );
  //     console.log(postToDislike);
  //     if (!postToDislike.length)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message:
  //             'Post Was Not Liked Yet By This User or User/Post does not exist',
  //           path: '/posts/post/like',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     await this.postLikesRespository.query(
  //       `delete from Post_Likes where postId='${deletePostLikeDto.postId}' and userId='${deletePostLikeDto.userId}'`,
  //     );

  //     return {
  //       statusCode: 200,
  //       method: 'DELETE',
  //       message: 'Post Disliked sucessfully',
  //       path: 'delete/post/like',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(`Failed to delete Post | Error Message: ${error.message}`);

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'DELETE',
  //         message: 'Failed to dislike Post',
  //         error: error.message,
  //         path: '/delete/post/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async comment(createPostCommentDto: CreatePostCommentDto) {
  //   try {
  //     const userData = await this.userRespository.findOneBy({
  //       id: createPostCommentDto.userId,
  //     });

  //     if (!userData)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'User Not Found.',
  //           path: '/users/user/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     const postData = await this.postRespository.findOneBy({
  //       id: createPostCommentDto.postId,
  //     });

  //     if (!postData)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'Post Not Found.',
  //           path: '/posts/post/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     const allPostComment = await this.postLikesRespository.query(
  //       `select * from Post_Comments where postId='${createPostCommentDto.postId}' and userId='${createPostCommentDto.userId}'`,
  //     );

  //     if (allPostComment.length > 0)
  //       throw new HttpException(
  //         {
  //           statusCode: 400,
  //           method: 'POST',
  //           message: 'User already comment this post',
  //           path: '/posts/post/comment',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     const commentToSave =
  //       this.postCommentsRespository.create(createPostCommentDto);

  //     const { postCommentId, comment, post, user, createdAt } =
  //       await this.postCommentsRespository.save({
  //         ...commentToSave,
  //         post: postData,
  //         user: userData,
  //       });
  //     return {
  //       statusCode: 201,
  //       method: 'POST',
  //       message: 'Post Comment created sucessfully',
  //       data: {
  //         id: postCommentId,
  //         comment,
  //         post,
  //         user,
  //         createdAt,
  //       },
  //       path: 'posts/post/comment',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to create Post Comment | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'POST',
  //         message: 'Failed to create Post Comment',
  //         error: error.message,
  //         path: 'posts/post/comment',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async uncomment(id: string) {
  //   try {
  //     const commentToDelete = await this.postCommentsRespository.findOneBy({
  //       postCommentId: id,
  //     });

  //     if (!commentToDelete)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'Get',
  //           message: 'Post Comment Not Found.',
  //           path: 'posts/post/comment',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     await this.postCommentsRespository.remove(commentToDelete);

  //     return {
  //       statusCode: 200,
  //       method: 'DELETE',
  //       message: 'Post Comment deleted sucessfully',
  //       path: '/delete/post/comment/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to Delete Post Comment | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'POST',
  //         message: 'Failed to delete Post Comment',
  //         error: error.message,
  //         path: 'posts/post/comment',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async updateComment(
  //   updatePostComment: Partial<UpdatePostCommentDto>,
  //   id: string,
  // ) {
  //   try {
  //     const commentToUpdate = await this.postCommentsRespository.findOneBy({
  //       postCommentId: id,
  //     });

  //     if (!commentToUpdate)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'Get',
  //           message: 'Post Comment Not.',
  //           path: 'posts/post/comment',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     await this.postCommentsRespository.update(id, updatePostComment);

  //     const { postCommentId, comment, post, user, createdAt, updateAt } =
  //       await this.postCommentsRespository.findOneBy({
  //         postCommentId: id,
  //       });

  //     return {
  //       statusCode: 200,
  //       method: 'PUT',
  //       message: 'Post updated sucessfully',
  //       data: {
  //         id: {
  //           id: postCommentId,
  //           comment,
  //           post,
  //           user,
  //           createdAt,
  //           updateAt,
  //         },
  //         comment,
  //         post,
  //         user,
  //         createdAt,
  //         updateAt,
  //       },
  //       path: '/update/post/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(
  //       `Failed to update Post Comment | Error Message: ${error.message}`,
  //     );

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'PUT',
  //         message: 'Failed to update Post Comment',
  //         error: error.message,
  //         path: '/update/post/comment/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async save(createPostSaveDto: CreatePostSaveDto) {
  //   try {
  //     const userData = await this.userRespository.findOneBy({
  //       id: createPostSaveDto.userId,
  //     });

  //     if (!userData)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'User Not Found.',
  //           path: '/users/user/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     const postData = await this.postRespository.findOneBy({
  //       id: createPostSaveDto.postId,
  //     });

  //     if (!postData)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message: 'Post Not Found.',
  //           path: '/posts/post/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     const isAnyAlreadySaved = await this.postLikesRespository.query(
  //       `select * from Post_Saved where postId='${createPostSaveDto.postId}' and userId='${createPostSaveDto.userId}'`,
  //     );

  //     if (isAnyAlreadySaved.length > 0)
  //       throw new HttpException(
  //         {
  //           statusCode: 400,
  //           method: 'POST',
  //           message: 'User already save this post',
  //           path: 'posts/post/save/:id',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     const postSavedToSave =
  //       this.postSavedRepository.create(createPostSaveDto);

  //     const { postSaveId, saved, post, user, createdAt } =
  //       await this.postSavedRepository.save({
  //         ...postSavedToSave,
  //         user: userData,
  //         post: postData,
  //       });

  //     return {
  //       statusCode: 200,
  //       method: 'POST',
  //       data: {
  //         id: postSaveId,
  //         saved,
  //         post,
  //         user,
  //         createdAt,
  //       },
  //       message: 'Post saved sucessfully',
  //       path: '/post/save',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(`Failed to save post | Error Message: ${error.message}`);

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'POST',
  //         message: 'Failed to save post',
  //         error: error.message,
  //         path: '/post/save',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async unsave(id: string) {
  //   try {
  //     const postToUnsave = await this.postSavedRepository.findOneBy({
  //       postSaveId: id,
  //     });

  //     if (!postToUnsave)
  //       throw new HttpException(
  //         {
  //           statusCode: 404,
  //           method: 'GET',
  //           message:
  //             'Post Was Not saved Yet By This User or User/Post does not exist',
  //           path: '/posts/post/save',
  //           timestamp: Date.now(),
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );

  //     await this.postSavedRepository.remove(postToUnsave);
  //     return {
  //       statusCode: 200,
  //       method: 'DELETE',
  //       message: 'Post Unsaved sucessfully',
  //       path: 'delete/post/save/:id',
  //       timestamp: Date.now(),
  //     };
  //   } catch (error) {
  //     console.log(`Failed to unsave Post | Error Message: ${error.message}`);

  //     throw new HttpException(
  //       {
  //         statusCode: 400,
  //         method: 'DELETE',
  //         message: 'Failed to unsave Post',
  //         error: error.message,
  //         path: '/delete/post/save/:id',
  //         timestamp: Date.now(),
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
