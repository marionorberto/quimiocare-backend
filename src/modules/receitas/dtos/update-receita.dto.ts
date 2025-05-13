import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateReceitaDto {
  @MaxLength(40, { message: 'O nome deve ter no máximo 40 caracteres' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @IsString({ message: 'O nome deve ser uma string!' })
  name: string;

  @MaxLength(40, { message: 'A descrição deve ter no máximo 40 caracteres!' })
  @MinLength(3, { message: 'A descrição deve ter no mínimo 3 caracteres!' })
  @IsString({ message: 'A descrição deve ser uma string!' })
  description: string;

  @IsString({ message: 'A url deve ser uma string!' })
  url: string;
}
