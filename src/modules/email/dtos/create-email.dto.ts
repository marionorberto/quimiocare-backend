import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEmailDto {
  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  to: string;
}
