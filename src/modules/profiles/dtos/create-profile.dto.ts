import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';

export class CreateProfileDto {
  @MaxLength(3, { message: 'O pais deve ter no máximo 3 caracteres!' })
  @MinLength(2, { message: 'O pais deve ter no mínimo 2 caracteres!' })
  @IsString({ message: 'Pais deve ser uma string' })
  @IsNotEmpty({ message: 'O País não  pode estar vazio!' })
  countryName: string;

  @IsNotEmpty({ message: 'data de nascimento não pode estar vazia' })
  birthday: Date;

  @MaxLength(50, { message: 'a biografia deve ter no máximo 25 caracters' })
  @MinLength(3, { message: 'a biografia deve ter no minimo 3 caracteres' })
  @IsString({ message: 'a biografia deve ser uma string' })
  @IsNotEmpty({ message: 'a biografia não poder estar nula' })
  bio: string;

  @MaxLength(1, { message: 'sexo deve ter no maximo 1 caracter' })
  @IsString({ message: 'Pais deve ser uma string' })
  @IsNotEmpty({ message: 'sexo não pode estar nulo' })
  sex: string;

  @MaxLength(13, { message: 'telefone deve ter no maximo 13 caracteres' })
  @IsString({ message: 'telefone deve ser string' })
  @IsNotEmpty({ message: 'telefone não poder estar vazia' })
  @IsOptional()
  phoneNumber?: string;

  @MaxLength(50, { message: 'endereco deve ter no maximo 50 caracteres' })
  @MinLength(9, { message: 'endereco deve ter no minimo 9 caracteres' })
  @IsString({ message: 'endereco deve ser uma string' })
  @IsNotEmpty({ message: 'telefone não poder estar vazia' })
  address: string;

  @MaxLength(50, { message: 'trabalho deve ter no minimo 50 caracteres' })
  @IsString({ message: 'trabalho deve ser uma string' })
  @IsNotEmpty({ message: 'Trabalho não pode estar nulo' })
  job: string;

  @MinLength(3, { message: 'o nome da imagem é curto' })
  @IsString({ message: 'a imagem deve ser um string' })
  @IsNotEmpty({ message: 'a imagem não pode estar vazia' })
  urlImg: string;

  @IsNotEmpty({ message: 'O tipo de cancer não pode estar vazio' })
  tags: CreateTagDto[];
}
