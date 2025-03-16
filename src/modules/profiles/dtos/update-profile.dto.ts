import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';

export class UpdateProfileDto {
  @MaxLength(3)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  countryName: string;

  @IsNotEmpty()
  birthday: Date;

  @MaxLength(300)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  bio: string;

  @MaxLength(100)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  job: string;

  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  urlImg: string;

  tags: CreateTagDto[];
}
