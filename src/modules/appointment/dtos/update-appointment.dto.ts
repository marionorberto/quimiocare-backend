import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EnumAppointmentType,
  EnumAppointmentStatus,
} from '../interfaces/interfaces';

export class UpdateAppointmentDto {
  @MaxLength(60, { message: 'O nome deve ter no máximo 60 caracteres' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @IsString({ message: 'O nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'O nome não pode estar nulo!' })
  @IsOptional()
  name: string;

  @MaxLength(60, { message: 'A descrição deve ter no máximo 60 caracteres!' })
  @MinLength(3, { message: 'A descrição deve ter no mínimo 3 caracteres!' })
  @IsString({ message: 'A descrição deve ser uma string!' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia!' })
  @IsOptional()
  description: string;

  @IsString({ message: 'A data da consulta não pode ser uma string!' })
  @IsNotEmpty({ message: 'A data da consulta não pode estar vazia!' })
  @IsOptional()
  dateAppointment: string;

  @MaxLength(25, { message: 'O Tipo não pode ter mais ter 25 caracteres' })
  @MinLength(3, { message: 'O Tipo  não pode ter menos de 3 caracteres!' })
  @IsString({ message: 'o Tipo não poder estar vazio' })
  @IsOptional()
  type: EnumAppointmentType;

  @MaxLength(25, { message: 'A descrição deve ter no máximo 60 caracteres' })
  @MinLength(3, { message: 'A descrição deve ter no máximo 60 caracteres' })
  @IsString({ message: 'A descrição deve ter no máximo 60 caracteres' })
  @IsOptional()
  statusAppointment: EnumAppointmentStatus;

  @IsString({ message: 'A Nota deve ser uma string!' })
  @IsNotEmpty({ message: 'A Nota não pode estar vazia' })
  @IsOptional()
  note: string;
}
