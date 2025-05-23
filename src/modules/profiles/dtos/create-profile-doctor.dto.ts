import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDoctorDto {
  @MaxLength(50, { message: 'a biografia deve ter no máximo 50 caracters' })
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

  @MinLength(6, { message: 'o nome da imagem é curto' })
  @IsString({ message: 'a imagem deve ser um string' })
  @IsNotEmpty({ message: 'a imagem não pode estar vazia' })
  urlImg: string;

  @IsString({ message: 'hospital deve ser um string' })
  @IsNotEmpty({ message: 'hospital não pode estar vazio' })
  hospital: string;

  @IsString({ message: 'Especialidade deve ser um string' })
  @IsNotEmpty({ message: 'Especialidade não pode estar vazio' })
  speciality: string;
}
