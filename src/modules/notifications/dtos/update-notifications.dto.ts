import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateNotificationsDto {
  @MaxLength(300)
  @MinLength(30)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(300)
  @MinLength(30)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subtitle?: string;

  @MaxLength(300)
  @MinLength(30)
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  read?: boolean;

  @MaxLength(60)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  linkAction?: string;
}
