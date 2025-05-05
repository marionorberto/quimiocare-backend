import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(50)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  posterImgLink: string;
}
