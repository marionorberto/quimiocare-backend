import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateFollowerDto {
  @IsUUID()
  @IsNotEmpty()
  follower: string;

  @IsUUID()
  @IsNotEmpty()
  followed: string;
}
