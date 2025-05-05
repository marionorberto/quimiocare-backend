import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreatePostSectionDto } from './post-sections/create-post-section.dto';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';

export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @MaxLength(200)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(50)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  linkPosterFile: string;

  @IsNotEmpty()
  tags: CreateTagDto[];

  @IsNotEmpty()
  sections: CreatePostSectionDto[];
}
