import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTipsCategoryDto {
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  description: string;
}
