import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsersDto {
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  @MaxLength(50)
  @MinLength(12)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(8)
  password: string;
}
