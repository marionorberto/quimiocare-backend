import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTipsDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
