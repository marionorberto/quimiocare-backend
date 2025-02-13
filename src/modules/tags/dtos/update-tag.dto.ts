import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTagDto {
  @MaxLength(30)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  description: string;
}
