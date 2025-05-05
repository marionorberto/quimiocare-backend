import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID, Length, MaxLength, MinLength } from 'class-validator';

export class UpdateFeedbackDto {
  
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Length(1, 5)
  @IsNotEmpty()
  @IsNumber()
  avaliation: number;

  @IsNotEmpty()
  comment!: number;
}
