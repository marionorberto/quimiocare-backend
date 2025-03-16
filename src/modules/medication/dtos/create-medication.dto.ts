import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateMedicationDto {
  @MaxLength(50, { message: 'O nome precisa no máximo 50 caracteres!' })
  @MinLength(3, { message: 'O nome precisa no mínimo 3 caracteres!' })
  @IsString({ message: 'O nome precisa ser uma string!' })
  name: string;

  @MaxLength(50, { message: 'A dosagem precisa no máximo 50 caracteres' })
  @MinLength(3, { message: 'A dosagem precisa no mínimo 3 caracteres' })
  @IsString({ message: 'A dosagem não pode ser nula!' })
  dosage: string;

  @MinLength(3, { message: 'A nota precisa no mínimo 3 caracteres' })
  @IsString({ message: 'A nota não pode ser nula!' })
  note: string;

  @IsString({ message: 'O formato da hora deve ser uma string' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'O formato da hora deve ser HH:mm (24 horas)',
  })
  timeReminder: string;
}
