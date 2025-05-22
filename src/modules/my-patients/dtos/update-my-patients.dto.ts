import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMyPatientsDto {
  @IsString({ message: 'O nome precisa ser uma string!' })
  @IsNotEmpty({ message: 'doctor não poder estár vazio' })
  @IsOptional()
  doctor: string;

  @IsString({ message: 'A dosagem não pode ser nula!' })
  @IsNotEmpty({ message: 'paciente não poder estár vazio' })
  @IsOptional()
  patient: string;
}
