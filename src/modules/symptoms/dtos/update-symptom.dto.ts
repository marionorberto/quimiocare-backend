import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { EnumSymptomSeverity } from '../interfaces/types';

export class UpdateSymptomDto {
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  name: string;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  description: string;

  @IsNumber()
  severity: EnumSymptomSeverity;
}
