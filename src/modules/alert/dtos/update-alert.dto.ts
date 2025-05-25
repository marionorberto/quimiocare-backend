import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAlertDto {
  @MaxLength(50, { message: 'Titulo deve ter ao máximo 50 caracteres' })
  @MinLength(10, { message: 'Titulo deve ter ao mínimo 10 caracteres' })
  @IsString({ message: 'Valor Inválido' })
  @IsNotEmpty({ message: 'titilo não pode estar vazio' })
  @IsOptional()
  title: string;

  @MaxLength(300, { message: 'conteudo deve ter ao mínimo 10 caracteres' })
  @MinLength(10, { message: 'conteudo deve ter ao mínimo 10 caracteres' })
  @IsString({ message: 'Valor Inválido' })
  @IsNotEmpty({ message: 'conteudo não pode estar vazio' })
  @IsOptional()
  content: string;

  @IsNotEmpty({ message: 'conteudo deve ter ao mínimo 10 caracteres' })
  @IsString({ message: 'Valor Inválido' })
  @IsNotEmpty({ message: 'status não pode estar vazio' })
  @IsOptional()
  status?: string;

  @IsString({ message: 'conteudo deve ter ao mínimo 10 caracteres' })
  @IsString({ message: 'Valor Inválido' })
  @IsNotEmpty({ message: 'rementente não pode estar vazio' })
  @IsOptional()
  sender: string;
}
