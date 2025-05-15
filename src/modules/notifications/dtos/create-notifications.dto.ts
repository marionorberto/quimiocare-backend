import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNotificationsDto {
  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subtitle?: string;

  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  img?: string;
}
