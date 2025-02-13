import {
  IsNotEmpty,
  Length,
  IsUUID,
  IsDate,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Min(1)
  @Max(5)
  @IsNumber()
  avaliation: number;

  @IsNotEmpty()
  comment!: number;
}
