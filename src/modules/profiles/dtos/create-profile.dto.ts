import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';

export class CreateProfileDto {
  @IsDateString()
  birthday: string;

  @IsNotEmpty()
  height: number;
  
  @IsNotEmpty()
  weight: number;

  @MaxLength(300)
  @MinLength(3)
  @IsString()
  bio: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  urlImg: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  tags: CreateTagDto[];
}
