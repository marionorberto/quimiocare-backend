import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFollowerDto {
  @IsUUID()
  @IsNotEmpty()
  follower: string;

  @IsUUID()
  @IsNotEmpty()
  followed: string;
}
