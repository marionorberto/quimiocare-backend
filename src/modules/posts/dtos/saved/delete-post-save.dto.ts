import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePostSaveDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
