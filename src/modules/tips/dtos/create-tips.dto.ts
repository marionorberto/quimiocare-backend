import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipsDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
