import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @MaxLength(300)
  @MinLength(10, { message: 'titulo deve ser maior que 10 caracteres' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(300)
  @MinLength(10, { message: 'subtitulo deve ser maior que 10 caracteres' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subtitle?: string;

  @MaxLength(300)
  @MinLength(10, { message: 'conteudo deve ser maior que 10 caracteres' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  img?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tag: string;
}
