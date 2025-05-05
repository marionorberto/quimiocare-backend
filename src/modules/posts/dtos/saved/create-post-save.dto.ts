import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePostSaveDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  saved: boolean;
}
