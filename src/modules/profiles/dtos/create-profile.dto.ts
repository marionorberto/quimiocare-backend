import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';

export class CreateProfileDto {
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

  @MaxLength(1)
  @IsString()
  @IsNotEmpty()
  sex: string;

  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @MaxLength(50)
  @MinLength(9)
  @IsString()
  @IsNotEmpty()
  address: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  job: string;

  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  urlImg: string;

  @IsNotEmpty()
  tags: CreateTagDto[];
}
