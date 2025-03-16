import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EnumSupportWishLevel } from '../interfaces/types';

export class UpdateMedicalInformationDto {
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  stage: string;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  bloodGroup: string;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  hospital: string;

  @IsDecimal()
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsDecimal()
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  codHospital: string;

  @MaxLength(40)
  @MinLength(3)
  @IsString()
  targetSupport: EnumSupportWishLevel;
}
