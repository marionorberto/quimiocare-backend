import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMyPatientsDto {
  @IsString({ message: 'O nome precisa ser uma string!' })
  @IsNotEmpty({ message: 'doctor não poder estár vazio' })
  doctor: string;

  @IsString({ message: 'A dosagem não pode ser nula!' })
  @IsNotEmpty({ message: 'paciente não poder estár vazio' })
  patient: string;
}
