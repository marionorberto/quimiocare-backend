import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePostLikeDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
