import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';

export class UpdateProfileDto {
  @MaxLength(3)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  countryName: string;

  @IsDate()
  birthday: Date;

  @IsNumber()
  @IsNotEmpty()
  yearsWorking: number;

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

  @IsBoolean()
  remoteJob: boolean;

  @MinLength(50)
  @IsString()
  @IsNotEmpty()
  urlImg: string;

  @MinLength(50)
  @IsString()
  @IsNotEmpty()
  website: string;

  tags: CreateTagDto[];
}
