import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  read?: boolean;

  @MaxLength(60)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  linkAction?: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
