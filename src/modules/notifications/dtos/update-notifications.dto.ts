import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateNotificationsDto {
  @MaxLength(300)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
  @IsOptional()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  img?: string;
}
