import { IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateUsersDto {
  @MaxLength(40)
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  email!: string;
}
