import { IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsString({ message: 'A consulta não poder estar vazio' })
  @IsOptional()
  booking: string;

  @IsString({ message: 'A medicação não poder estar vazio' })
  @IsOptional()
  medication: string;

  @IsString({ message: 'o sintoma não poder estar vazio' })
  @IsOptional()
  symptom: string;
}
