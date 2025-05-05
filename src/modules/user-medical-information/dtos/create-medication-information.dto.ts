import {
  // IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EnumSupportWishLevel } from '../interfaces/types';

export class CreateMedicalInformationDto {
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  stage: string;

  @MaxLength(40)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  bloodGroup: string;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  hospital: string;

  @IsOptional()
  height?: number;

  @IsOptional()
  weight?: number;

  @MaxLength(40)
  @IsString()
  codHospital: string;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  targetSupport: EnumSupportWishLevel;
}
