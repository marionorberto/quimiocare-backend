import { IsEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostContentDto {
  @MaxLength(300)
  @MinLength(30)
  @IsString()
  @IsEmpty()
  content: string;
}
