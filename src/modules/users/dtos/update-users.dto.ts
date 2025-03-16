import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { EnumTypeUser } from '../interfaces/interfaces';

export class UpdateUsersDto {
  @MaxLength(40, { message: 'O Username deve ter no máximo 40 caracteres!' })
  @MinLength(3, { message: 'O Username deve ter no mínimo 3 caracteres!' })
  @IsString()
  username: string;

  @IsEmail()
  @IsString({ message: 'O Email deve ser uma string!' })
  @MaxLength(50, { message: 'O Email deve ter no máximo 50 caracteres!' })
  @MinLength(12, { message: 'O Email deve ter no mínimo 12 caracteres!' })
  @IsNotEmpty({ message: 'O Email deve pode estar vazio!' })
  email: string;

  @IsString({ message: 'A Password não pode ser Inválida!' })
  @IsNotEmpty({ message: 'A Password não poder estar vazio!' })
  @MaxLength(30, { message: 'A Password deve ter no máximo 30 caracteres!' })
  @MinLength(8, { message: 'A Password deve ter no mínimo 8 caracteres!' })
  password: string;

  @IsString({ message: 'tipo de usuário deve ser uma string!' })
  @IsNotEmpty({ message: 'Tipo de usuário não pode ser nulo!' })
  typeUser: EnumTypeUser;
}
