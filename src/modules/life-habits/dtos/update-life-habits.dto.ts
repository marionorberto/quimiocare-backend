import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserLifeHabitsDto {
  @MaxLength(40)
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  description: string;
}
