import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePostCommentDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  comment: string;
}
